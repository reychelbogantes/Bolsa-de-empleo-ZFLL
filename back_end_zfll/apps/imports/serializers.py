from rest_framework import serializers
from .models import LoteImportacion

class LoteImportacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoteImportacion
        fields = ["id", "archivo", "estado", "total_registros", "creados",
                  "actualizados", "con_error", "log_errores", "fecha_subida"]
        read_only_fields = ["id", "estado", "total_registros", "creados",
                           "actualizados", "con_error", "log_errores", "fecha_subida"]
