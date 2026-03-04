"""Serializers for companies app."""
from rest_framework import serializers
from .models import Empresa, GaleriaEmpresa


class GaleriaEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GaleriaEmpresa
        fields = ["id", "imagen", "orden"]


class EmpresaSerializer(serializers.ModelSerializer):
    galeria         = GaleriaEmpresaSerializer(many=True, read_only=True)
    sector_nombre   = serializers.CharField(source="sector.nombre", read_only=True, default=None)
    tamano_nombre   = serializers.CharField(source="tamano_empresa.nombre", read_only=True, default=None)
    # Datos del usuario dueño de la empresa
    usuario_email   = serializers.EmailField(source="usuario.email", read_only=True)
    usuario_phone   = serializers.CharField(source="usuario.phone", read_only=True, default=None)

    class Meta:
        model = Empresa
        fields = [
            "id", "nombre", "cedula_juridica", "descripcion",
            "sector", "sector_nombre",
            "tamano_empresa", "tamano_nombre",
            "proceso_contratacion",
            "tiene_url_externa", "url_externa", "foto_perfil",
            "contacto_interesados", "contacto_admin",
            "ubicacion", "activa",
            "galeria", "fecha_creacion",
            "usuario_email", "usuario_phone",
        ]
        read_only_fields = ["id", "fecha_creacion", "usuario_email", "usuario_phone"]