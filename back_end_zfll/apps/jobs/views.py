from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Vacante
from .serializers import VacanteSerializer
from .filters import VacanteFilter

class VacanteListView(generics.ListCreateAPIView):
    serializer_class = VacanteSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = VacanteFilter
    search_fields = ["titulo", "descripcion", "empresa__nombre"]
    ordering_fields = ["fecha_publicacion", "titulo"]
    ordering = ["-fecha_publicacion"]

    def get_queryset(self):
        return Vacante.objects.select_related(
            "empresa", "area_trabajo", "tipo_contrato", "estado_vacante"
        )

class VacanteDetailView(generics.RetrieveUpdateAPIView):
    queryset = Vacante.objects.all()
    serializer_class = VacanteSerializer
    permission_classes = [IsAuthenticated]
