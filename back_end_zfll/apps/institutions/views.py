from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Institucion
from .serializers import InstitucionSerializer

class InstitucionListView(generics.ListAPIView):
    queryset = Institucion.objects.filter(activa=True)
    serializer_class = InstitucionSerializer
    permission_classes = [IsAuthenticated]

class InstitucionDetailView(generics.RetrieveUpdateAPIView):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer
    permission_classes = [IsAuthenticated]
