from rest_framework import generics
from .models import ProgramaFormacion
from .serializers import ProgramaFormacionSerializer
from shared.permissions import IsInstitucion  # si ya lo usas en otras views

class ProgramasListCreateView(generics.ListCreateAPIView):
    serializer_class = ProgramaFormacionSerializer
    permission_classes = [IsInstitucion]

    def get_queryset(self):
        return ProgramaFormacion.objects.filter(institucion=self.request.user.institucion)

    def perform_create(self, serializer):
        serializer.save(institucion=self.request.user.institucion)

class ProgramasDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProgramaFormacionSerializer
    permission_classes = [IsInstitucion]

    def get_queryset(self):
        return ProgramaFormacion.objects.filter(institucion=self.request.user.institucion)