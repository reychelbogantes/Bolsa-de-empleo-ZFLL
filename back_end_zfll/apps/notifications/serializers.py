from rest_framework import serializers
from .models import Notificacion, PreferenciaNotificacion

class NotificacionSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(source="tipo_evento.nombre", read_only=True, default=None)
    class Meta:
        model = Notificacion
        fields = ["id", "tipo_evento", "tipo_evento_nombre", "mensaje", "leido", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]

class PreferenciaNotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreferenciaNotificacion
        fields = ["id", "tipo_evento", "medio", "habilitado"]
