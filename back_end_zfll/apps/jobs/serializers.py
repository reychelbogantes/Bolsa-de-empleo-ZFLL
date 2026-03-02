from rest_framework import serializers
from .models import Vacante
class VacanteSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source="empresa.nombre", read_only=True)
    area_trabajo_nombre = serializers.CharField(source="area_trabajo.nombre", read_only=True, default=None)
    class Meta:
        model = Vacante
        fields = "__all__"
        read_only_fields = ["id", "fecha_publicacion"]
