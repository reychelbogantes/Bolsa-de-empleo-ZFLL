from rest_framework import serializers
from .models import CvVersion, Documento
class CvVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CvVersion
        fields = ["id", "nombre_etiqueta", "archivo", "es_predeterminado", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = ["id", "tipo_documento", "archivo", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]
