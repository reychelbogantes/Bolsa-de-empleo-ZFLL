from rest_framework import serializers
from .models import Postulacion, HistorialPostulacion

class HistorialPostulacionSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.CharField(source="estado.nombre", read_only=True, default=None)
    class Meta:
        model = HistorialPostulacion
        fields = ["id", "estado", "estado_nombre", "fecha"]

class PostulacionSerializer(serializers.ModelSerializer):
    historial = HistorialPostulacionSerializer(many=True, read_only=True)
    vacante_titulo = serializers.CharField(source="vacante.titulo", read_only=True)
    estado_nombre = serializers.CharField(source="estado_actual.nombre", read_only=True, default=None)
    class Meta:
        model = Postulacion
        fields = ["id", "vacante", "vacante_titulo", "cv_version", "estado_actual",
                  "estado_nombre", "visto", "fecha_postulacion", "historial"]
        read_only_fields = ["id", "fecha_postulacion", "visto"]
