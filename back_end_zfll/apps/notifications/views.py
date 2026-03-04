from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notificacion, PreferenciaNotificacion
from .serializers import (
    EnviarNotificacionSerializer,
    NotificacionSerializer,
    PreferenciaNotificacionSerializer,
)
from .services import NotificationService


# ──────────────────────────────────────────────
# Notifications (inbox)
# ──────────────────────────────────────────────

class NotificacionListView(generics.ListAPIView):
    """GET /api/notifications/?unread=true — polling endpoint."""

    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notificacion.objects.filter(usuario=self.request.user)
        if self.request.query_params.get("unread") == "true":
            qs = qs.filter(leido=False)
        return qs


class NotificacionCountView(APIView):
    """GET /api/notifications/count/ — lightweight badge counter."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notificacion.objects.filter(
            usuario=request.user, leido=False
        ).count()
        return Response({"unread_count": count})


class MarcarLeidaView(APIView):
    """PATCH /api/notifications/{id}/read/"""

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        updated = Notificacion.objects.filter(
            pk=pk, usuario=request.user
        ).update(leido=True)
        if not updated:
            return Response(
                {"detail": "Notificación no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({"message": "Marcada como leída"})


class MarcarTodasLeidasView(APIView):
    """PATCH /api/notifications/read-all/"""

    permission_classes = [IsAuthenticated]

    def patch(self, request):
        count = Notificacion.objects.filter(
            usuario=request.user, leido=False
        ).update(leido=True)
        return Response({"message": f"{count} notificaciones marcadas como leídas"})


class NotificacionDeleteView(APIView):
    """DELETE /api/notifications/{id}/delete/"""

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        deleted, _ = Notificacion.objects.filter(
            pk=pk, usuario=request.user
        ).delete()
        if not deleted:
            return Response(
                {"detail": "Notificación no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


# ──────────────────────────────────────────────
# Preferences
# ──────────────────────────────────────────────

class PreferenciaListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/notifications/preferences/       — list user preferences
    POST /api/notifications/preferences/       — create one preference
    """

    serializer_class = PreferenciaNotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PreferenciaNotificacion.objects.filter(
            usuario=self.request.user
        ).select_related("tipo_evento", "medio")

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class PreferenciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/notifications/preferences/{id}/
    PATCH  /api/notifications/preferences/{id}/
    DELETE /api/notifications/preferences/{id}/
    """

    serializer_class = PreferenciaNotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PreferenciaNotificacion.objects.filter(usuario=self.request.user)


class PreferenciaBulkView(APIView):
    """
    POST /api/notifications/preferences/bulk/
    Initialize all preference combinations for the current user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        created = NotificationService.bulk_create_preferences(request.user)
        return Response(
            {"message": f"{len(created)} preferencias creadas."},
            status=status.HTTP_201_CREATED,
        )


# ──────────────────────────────────────────────
# Company → Candidate notification
# ──────────────────────────────────────────────

class EnviarNotificacionView(APIView):
    """
    POST /api/notifications/send/
    Companies can send notifications to selected candidates.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EnviarNotificacionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from apps.accounts.models import User

        usuario_ids = serializer.validated_data["usuario_ids"]
        titulo = serializer.validated_data["titulo"]
        mensaje = serializer.validated_data["mensaje"]
        url_accion = serializer.validated_data.get("url_accion", "")

        usuarios = User.objects.filter(pk__in=usuario_ids, is_active=True)
        sent = 0

        for usuario in usuarios:
            notif = NotificationService.create(
                usuario=usuario,
                tipo_evento_nombre="mensaje_empresa",
                titulo=titulo,
                mensaje=mensaje,
                url_accion=url_accion,
            )
            if notif:
                sent += 1

        return Response(
            {"message": f"Notificación enviada a {sent} usuario(s)."},
            status=status.HTTP_201_CREATED,
        )
