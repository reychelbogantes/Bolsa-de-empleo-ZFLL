"""Views for companies app."""
from django.apps import apps as django_apps
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Empresa
from .serializers import EmpresaSerializer


# ── ID de rol empresa según tabla BD ─────────────────────────
ROL_EMPRESA_ID = 2


def _assign_role_to_empresa_user(empresa_obj):
    """Asigna rol_id=2 (empresa) al usuario dueño de la empresa si no lo tiene ya."""
    user = getattr(empresa_obj, 'usuario', None)
    if not user:
        return
    try:
        UsuarioRol = django_apps.get_model('accounts', 'UsuarioRol')
        Rol        = django_apps.get_model('accounts', 'Rol')
        rol_obj    = Rol.objects.get(id=ROL_EMPRESA_ID)
        UsuarioRol.objects.get_or_create(usuario=user, rol=rol_obj)
    except Exception:
        if hasattr(user, 'add_role'):
            try:
                user.add_role('empresa')
            except Exception:
                pass


class EmpresaListView(generics.ListAPIView):
    """
    GET /api/companies/
    - Admin: devuelve TODAS las empresas (activas y pendientes)
    - Otros: solo empresas activas
    Filtro opcional: ?activa=false para pendientes
    """
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Empresa.objects.select_related("usuario", "sector", "tamano_empresa").all()

        is_admin = (
            user.is_staff
            or user.is_superuser
            or (hasattr(user, 'has_role') and user.has_role("admin"))
        )
        if not is_admin:
            qs = qs.filter(activa=True)

        activa_param = self.request.query_params.get("activa")
        if activa_param is not None:
            qs = qs.filter(activa=activa_param.lower() == "true")

        return qs


class EmpresaDetailView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/companies/{id}/"""
    queryset = Empresa.objects.select_related("usuario", "sector", "tamano_empresa").all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        """Al aprobar (activa=True), asigna rol_id=2 al usuario dueño."""
        instance = serializer.save()
        if instance.activa is True:
            _assign_role_to_empresa_user(instance)

class EmpresaMeView(APIView):
    """
    GET /api/companies/me/
    PATCH /api/companies/me/
    Devuelve/actualiza la empresa del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            empresa = Empresa.objects.select_related(
                "usuario", "sector", "tamano_empresa"
            ).get(usuario=request.user)
            serializer = EmpresaSerializer(empresa)
            return Response(serializer.data)
        except Empresa.DoesNotExist:
            return Response(
                {"detail": "No tienes una empresa asociada."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def patch(self, request):
        try:
            empresa = Empresa.objects.select_related(
                "usuario", "sector", "tamano_empresa"
            ).get(usuario=request.user)
        except Empresa.DoesNotExist:
            return Response(
                {"detail": "No tienes una empresa asociada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = EmpresaSerializer(empresa, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)