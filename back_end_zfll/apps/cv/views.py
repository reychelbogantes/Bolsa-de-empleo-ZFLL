from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CvVersion, Documento
from .serializers import CvVersionSerializer, DocumentoSerializer, CvPreviewSerializer


class CvVersionListCreateView(generics.ListCreateAPIView):
    serializer_class = CvVersionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CvVersion.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class CvVersionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CvVersionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CvVersion.objects.filter(usuario=self.request.user)


class DocumentoListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentoSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Documento.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class CvPreviewView(APIView):
    """
    GET /api/cv/preview/
    Returns all user profile data aggregated and ready for the CV PDF generator.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CvPreviewSerializer(instance=user)
        return Response(serializer.data)
