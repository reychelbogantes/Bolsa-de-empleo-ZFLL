from rest_framework import serializers
from .models import SolicitudPasantia

class SolicitudPasantiaSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source="institucion.nombre", read_only=True)
    
    class Meta:
        model = SolicitudPasantia
        # El frontend espera: id, sigla, institucion, cantidad, area, encargado, estado
        fields = [
            "id", 
            "sigla", 
            "institucion_nombre", # Se mapeará a 'institucion' en el view o acá
            "cantidad", 
            "area", 
            "encargado", 
            "estado"
        ]
        
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Renombramos institucion_nombre a institucion para match exacto con frontend
        ret["institucion"] = ret.pop("institucion_nombre")
        return ret
