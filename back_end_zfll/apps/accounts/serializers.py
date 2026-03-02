"""Serializers for accounts app."""

from rest_framework import serializers

from .models import PerfilAspirante, PerfilPracticante, User


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "auth_method",
            "consent_given",
            "is_active",
            "roles",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "roles"]

    def get_roles(self, obj):
        return obj.get_roles()


class PerfilAspiranteSerializer(serializers.ModelSerializer):
    estado_laboral_nombre = serializers.CharField(
        source="estado_laboral.nombre", read_only=True, default=None
    )

    class Meta:
        model = PerfilAspirante
        fields = [
            "id",
            "nombre_completo",
            "resumen_profesional",
            "estado_laboral",
            "estado_laboral_nombre",
            "consentimiento_datos",
            "extra_data",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion"]


class PerfilPracticanteSerializer(serializers.ModelSerializer):
    nivel_academico_nombre = serializers.CharField(
        source="nivel_academico.nombre", read_only=True, default=None
    )
    estado_practica_nombre = serializers.CharField(
        source="estado_practica.nombre", read_only=True, default=None
    )

    class Meta:
        model = PerfilPracticante
        fields = [
            "id",
            "institucion",
            "programa",
            "nivel_academico",
            "nivel_academico_nombre",
            "estado_practica",
            "estado_practica_nombre",
            "periodo_inicio",
            "periodo_fin",
            "horas_requeridas",
            "cargado_por_institucion",
            "extra_data",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion", "cargado_por_institucion"]
