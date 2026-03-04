"""Serializers for accounts app."""

from rest_framework import serializers

from .models import PerfilAspirante, PerfilPracticante, User, Rol, UsuarioRol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ["id", "nombre"]


class UsuarioRolSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source="rol.nombre", read_only=True)

    class Meta:
        model = UsuarioRol
        fields = ["id", "rol", "rol_nombre"]
        read_only_fields = ["id", "rol_nombre"]

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
class EgresadoListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    correo = serializers.EmailField()
    carrera = serializers.CharField(allow_blank=True)
    estado = serializers.CharField(allow_blank=True)

    # opcionales si luego quieres pintarlas
    programa_id = serializers.IntegerField(required=False, allow_null=True)
    programa_nombre = serializers.CharField(required=False, allow_blank=True)

def build_egresado_from_perfil(perfil: PerfilPracticante):
    u = perfil.usuario
    nombre = (f"{u.first_name or ''} {u.last_name or ''}".strip()) or (u.username or u.email or "Egresado")

    carrera = ""
    programa_id = None
    programa_nombre = ""

    if getattr(perfil, "programa_id", None):
        programa_id = perfil.programa_id
        try:
            programa_nombre = perfil.programa.nombre
        except Exception:
            programa_nombre = ""
        carrera = programa_nombre or ""

    # Estado: si tu PerfilPracticante tiene un campo estado úsalo, si no dejamos "DISPONIBLE"
    estado = getattr(perfil, "estado", None) or "DISPONIBLE"

    return {
        "id": u.id,
        "nombre": nombre,
        "correo": u.email,
        "carrera": carrera,
        "estado": estado,
        "programa_id": programa_id,
        "programa_nombre": programa_nombre,
    }