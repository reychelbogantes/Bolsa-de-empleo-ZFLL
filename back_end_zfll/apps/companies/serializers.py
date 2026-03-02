"""Serializers for companies app."""
from rest_framework import serializers
from .models import Empresa, GaleriaEmpresa

class GaleriaEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GaleriaEmpresa
        fields = ["id", "imagen", "orden"]

class EmpresaSerializer(serializers.ModelSerializer):
    galeria = GaleriaEmpresaSerializer(many=True, read_only=True)
    sector_nombre = serializers.CharField(source="sector.nombre", read_only=True, default=None)
    tamano_nombre = serializers.CharField(source="tamano_empresa.nombre", read_only=True, default=None)

    class Meta:
        model = Empresa
        fields = [
            "id", "nombre", "descripcion", "sector", "sector_nombre",
            "tamano_empresa", "tamano_nombre", "proceso_contratacion",
            "tiene_url_externa", "url_externa", "foto_perfil",
            "contacto_interesados", "activa", "galeria", "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion"]
