from rest_framework import serializers

from .models import AuditoriaEvento, AuditoriaEventoDetalle


class AuditoriaEventoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditoriaEventoDetalle
        fields = ["id", "campo", "valor_anterior", "valor_nuevo"]


class AuditoriaEventoSerializer(serializers.ModelSerializer):
    accion_nombre = serializers.CharField(source="accion.nombre", read_only=True)
    entidad_nombre = serializers.CharField(source="entidad_tipo.nombre", read_only=True)
    realizado_por_email = serializers.CharField(
        source="realizado_por_usuario.email", read_only=True
    )
    detalles = AuditoriaEventoDetalleSerializer(many=True, read_only=True)

    class Meta:
        model = AuditoriaEvento
        fields = [
            "id",
            "fecha",
            "accion",
            "accion_nombre",
            "entidad_tipo",
            "entidad_nombre",
            "entidad_id",
            "realizado_por_usuario",
            "realizado_por_email",
            "detalles",
        ]