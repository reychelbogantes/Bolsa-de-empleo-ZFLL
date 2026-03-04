"""Views for accounts app."""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from shared.permissions import IsInstitucion
from shared.permissions import IsCandidate

from .models import PerfilAspirante, PerfilPracticante, User
from .serializers import (
    PerfilAspiranteSerializer,
    PerfilPracticanteSerializer,
    UserSerializer,
)
from apps.institutions.serializers import build_egresado_from_perfil

class EgresadosInstitucionListView(APIView):
    """
    GET /api/accounts/egresados/
    Lista egresados (practicantes) vinculados a la institución del usuario autenticado.
    """
    permission_classes = [IsAuthenticated, IsInstitucion]

    def get(self, request):
        inst = request.user.institucion
        qs = (
            PerfilPracticante.objects
            .select_related("usuario", "programa")
            .filter(institucion=inst)
            .order_by("-id")
        )

        data = [build_egresado_from_perfil(p) for p in qs]
        return Response(data)

class UserMeView(generics.RetrieveAPIView):
    """GET /api/accounts/me/ — perfil del usuario autenticado."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PerfilAspiranteView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilAspiranteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return PerfilAspirante.objects.get(usuario=self.request.user)
        except PerfilAspirante.DoesNotExist:
            raise Http404("Perfil aspirante no encontrado.")


class PerfilPracticanteView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilPracticanteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return PerfilPracticante.objects.get(usuario=self.request.user)
        except PerfilPracticante.DoesNotExist:
            raise Http404("Perfil practicante no encontrado.")


class SwitchRolView(APIView):
    """POST /api/accounts/profile/switch-rol/ — switch entre aspirante y practicante."""
    permission_classes = [IsCandidate]

    def post(self, request):
        target_type = request.data.get("target_type")
        confirm = request.data.get("confirm", False)

        if target_type not in ("aspirante", "practicante"):
            return Response(
                {"error": "target_type debe ser 'aspirante' o 'practicante'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm:
            return Response(
                {"error": "Debe confirmar el cambio con confirm: true"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        if user.has_role(target_type):
            return Response(
                {"error": f"Ya tienes el rol de {target_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.add_role(target_type)

        if target_type == "aspirante":
            PerfilAspirante.objects.get_or_create(usuario=user)
        elif target_type == "practicante":
            PerfilPracticante.objects.get_or_create(usuario=user)

        return Response(
            {"message": f"Rol cambiado a {target_type}", "roles": user.get_roles()},
            status=status.HTTP_200_OK,
        )


class AdminUserListView(APIView):
    """
    GET /api/admin/users/?role=<nombre_rol>
    Lista usuarios filtrados por rol. Solo admins pueden acceder.

    Ejemplos:
      GET /api/admin/users/?role=aspirante   → rol_id = 1
      GET /api/admin/users/?role=empresa     → rol_id = 2
      GET /api/admin/users/?role=institucion → rol_id = 3
    """
    permission_classes = [IsAuthenticated]

    def _is_admin(self, user):
        return (
            user.is_staff
            or user.is_superuser
            or (hasattr(user, 'has_role') and user.has_role('admin'))
        )

    def get(self, request):
        if not self._is_admin(request.user):
            return Response(
                {"detail": "No tienes permiso para ver esta información."},
                status=status.HTTP_403_FORBIDDEN,
            )

        role_name = request.query_params.get('role', '').strip().lower()

        qs = User.objects.filter(soft_deleted=False).prefetch_related('usuario_roles__rol')

        if role_name:
            qs = qs.filter(usuario_roles__rol__nombre=role_name)

        # Serializar manualmente para incluir info relevante
        result = []
        for u in qs:
            # Intentar obtener nombre desde first_name o perfil_aspirante
            nombre = u.first_name or ''
            if not nombre:
                try:
                    perfil = u.perfil_aspirante
                    nombre = perfil.nombre_completo or ''
                except Exception:
                    pass

            result.append({
                'id':               u.id,
                'email':            u.email,
                'phone':            u.phone or '',
                'nombre_completo':  nombre,
                'is_active':        u.is_active,
                'created_at':       u.created_at.isoformat() if u.created_at else '',
                'roles':            u.get_roles(),
            })

        return Response(result, status=status.HTTP_200_OK)


class AdminUserDetailView(APIView):
    """
    GET/PATCH/DELETE /api/admin/users/{id}/
    Gestión individual de usuario por parte del admin.
    """
    permission_classes = [IsAuthenticated]

    def _is_admin(self, user):
        return (
            user.is_staff
            or user.is_superuser
            or (hasattr(user, 'has_role') and user.has_role('admin'))
        )

    def _get_user(self, pk):
        try:
            return User.objects.get(pk=pk, soft_deleted=False)
        except User.DoesNotExist:
            raise Http404("Usuario no encontrado.")

    def get(self, request, pk):
        if not self._is_admin(request.user):
            return Response({"detail": "Prohibido."}, status=status.HTTP_403_FORBIDDEN)
        u = self._get_user(pk)
        ser = UserSerializer(u)
        return Response(ser.data)

    def patch(self, request, pk):
        if not self._is_admin(request.user):
            return Response({"detail": "Prohibido."}, status=status.HTTP_403_FORBIDDEN)
        u = self._get_user(pk)

        # Campos permitidos a modificar
        allowed = ['first_name', 'last_name', 'phone', 'is_active']
        for field in allowed:
            if field in request.data:
                setattr(u, field, request.data[field])
        u.save()

        ser = UserSerializer(u)
        return Response(ser.data)

    def delete(self, request, pk):
        if not self._is_admin(request.user):
            return Response({"detail": "Prohibido."}, status=status.HTTP_403_FORBIDDEN)
        u = self._get_user(pk)
        u.soft_deleted = True
        u.is_active = False
        u.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
