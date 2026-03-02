from rest_framework import serializers
from .models import Institucion, ProgramaFormacion

class ProgramaFormacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramaFormacion
        fields = ["id", "nombre", "descripcion", "activo"]

class InstitucionSerializer(serializers.ModelSerializer):
    programas = ProgramaFormacionSerializer(many=True, read_only=True)
    class Meta:
        model = Institucion
        fields = ["id", "nombre", "descripcion", "activa", "programas", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]
