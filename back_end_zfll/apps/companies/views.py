"""Views for companies app."""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from shared.permissions import IsEmpresa, IsObjectOwner
from .models import Empresa
from .serializers import EmpresaSerializer

class EmpresaListView(generics.ListAPIView):
    """GET /api/companies/ — listado público de empresas activas."""
    queryset = Empresa.objects.filter(activa=True)
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]

class EmpresaDetailView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/companies/{id}/"""
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]
