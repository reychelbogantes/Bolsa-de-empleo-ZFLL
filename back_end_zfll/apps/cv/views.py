from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CvVersion, Documento
from .serializers import CvVersionSerializer, DocumentoSerializer

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
