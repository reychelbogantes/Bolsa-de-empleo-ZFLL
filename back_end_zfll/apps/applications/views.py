from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Postulacion
from .serializers import PostulacionSerializer

class MisPostulacionesView(generics.ListCreateAPIView):
    """GET /api/applications/my/ — postulaciones del candidato."""
    serializer_class = PostulacionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Postulacion.objects.filter(usuario=self.request.user).select_related("vacante", "estado_actual")
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
