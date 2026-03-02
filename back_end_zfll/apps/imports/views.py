from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from shared.permissions import IsInstitucion
from .models import LoteImportacion
from .serializers import LoteImportacionSerializer

class LoteImportacionListView(generics.ListAPIView):
    """GET /api/imports/ — lotes de la institución del usuario."""
    serializer_class = LoteImportacionSerializer
    permission_classes = [IsInstitucion]
    def get_queryset(self):
        return LoteImportacion.objects.filter(subido_por=self.request.user)

class LoteImportacionUploadView(APIView):
    """POST /api/imports/upload/"""
    permission_classes = [IsInstitucion]
    def post(self, request):
        archivo = request.FILES.get("file")
        if not archivo:
            return Response({"error": "Archivo requerido"}, status=status.HTTP_400_BAD_REQUEST)
        lote = LoteImportacion.objects.create(
            institucion=request.user.institucion,
            subido_por=request.user,
            archivo=archivo,
        )
        # TODO: lanzar tarea Celery process_student_batch.delay(lote.id)
        return Response(LoteImportacionSerializer(lote).data, status=status.HTTP_201_CREATED)

class LoteImportacionStatusView(generics.RetrieveAPIView):
    """GET /api/imports/{id}/status/"""
    serializer_class = LoteImportacionSerializer
    permission_classes = [IsInstitucion]
    def get_queryset(self):
        return LoteImportacion.objects.filter(subido_por=self.request.user)
