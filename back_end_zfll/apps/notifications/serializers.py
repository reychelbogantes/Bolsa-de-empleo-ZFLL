from rest_framework import serializers
from .models import Notificacion, PreferenciaNotificacion


class NotificacionSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(
        source="tipo_evento.nombre", read_only=True, default=None
    )
    medio_nombre = serializers.CharField(
        source="medio.nombre", read_only=True, default=None
    )

    class Meta:
        model = Notificacion
        fields = [
            "id",
            "tipo_evento",
            "tipo_evento_nombre",
            "medio",
            "medio_nombre",
            "titulo",
            "mensaje",
            "url_accion",
            "leido",
            "enviado",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion"]


class NotificacionCountSerializer(serializers.Serializer):
    """Lightweight serializer for the unread badge."""
    unread_count = serializers.IntegerField()


class PreferenciaNotificacionSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(
        source="tipo_evento.nombre", read_only=True
    )
    medio_nombre = serializers.CharField(source="medio.nombre", read_only=True)

    class Meta:
        model = PreferenciaNotificacion
        fields = [
            "id",
            "tipo_evento",
            "tipo_evento_nombre",
            "medio",
            "medio_nombre",
            "habilitado",
        ]


class EnviarNotificacionSerializer(serializers.Serializer):
    """Serializer for companies to send notifications to candidates."""
    usuario_ids = serializers.ListField(
        child=serializers.IntegerField(), min_length=1
    )
    titulo = serializers.CharField(max_length=255)
    mensaje = serializers.CharField()
    url_accion = serializers.CharField(max_length=500, required=False, default="")
