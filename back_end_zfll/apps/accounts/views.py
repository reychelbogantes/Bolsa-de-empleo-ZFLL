"""Views for accounts app."""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404

from shared.permissions import IsCandidate

from .models import PerfilAspirante, PerfilPracticante
from .serializers import (
    PerfilAspiranteSerializer,
    PerfilPracticanteSerializer,
    UserSerializer,
)


class UserMeView(generics.RetrieveAPIView):
    """GET /api/accounts/me/ — perfil del usuario autenticado."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PerfilAspiranteView(generics.RetrieveUpdateAPIView):
    # ...
    def get_object(self):
        try:
            return PerfilAspirante.objects.get(usuario=self.request.user)
        except PerfilAspirante.DoesNotExist:
            raise Http404("Perfil aspirante no encontrado.")
class PerfilPracticanteView(generics.RetrieveUpdateAPIView):
    # ...
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

        # Agregar nuevo rol y crear perfil si no existe
        user.add_role(target_type)

        if target_type == "aspirante":
            PerfilAspirante.objects.get_or_create(usuario=user)
        elif target_type == "practicante":
            PerfilPracticante.objects.get_or_create(usuario=user)

        return Response(
            {
                "message": f"Rol cambiado a {target_type}",
                "roles": user.get_roles(),
            },
            status=status.HTTP_200_OK,
        )
