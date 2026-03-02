from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notificacion, PreferenciaNotificacion
from .serializers import NotificacionSerializer, PreferenciaNotificacionSerializer

class NotificacionListView(generics.ListAPIView):
    """GET /api/notifications/?unread=true — polling endpoint."""
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        qs = Notificacion.objects.filter(usuario=self.request.user)
        if self.request.query_params.get("unread") == "true":
            qs = qs.filter(leido=False)
        return qs

class MarcarLeidaView(APIView):
    """PATCH /api/notifications/{id}/read/"""
    permission_classes = [IsAuthenticated]
    def patch(self, request, pk):
        Notificacion.objects.filter(pk=pk, usuario=request.user).update(leido=True)
        return Response({"message": "Marcada como leída"})

class MarcarTodasLeidasView(APIView):
    """PATCH /api/notifications/read-all/"""
    permission_classes = [IsAuthenticated]
    def patch(self, request):
        count = Notificacion.objects.filter(usuario=request.user, leido=False).update(leido=True)
        return Response({"message": f"{count} notificaciones marcadas como leídas"})

class PreferenciaListView(generics.ListCreateAPIView):
    serializer_class = PreferenciaNotificacionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return PreferenciaNotificacion.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
