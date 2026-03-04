from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SolicitudPasantia
from .serializers import SolicitudPasantiaSerializer

class PasantiasDashboardView(APIView):
    """
    Retorna el conteo y listas de solicitudes recibidas y enviadas.
    Para una Empresa: recibidas = solicitudes hacia ella, enviadas = solicitudes de ella.
    Para una Institucion: enviadas = solicitudes a empresas, recibidas = solicitudes de empresas a ella.
    El frontend asume que quien consulta ve 'recibidas' y 'enviadas'.
    """
    # permission_classes = [IsAuthenticated] # Descomentar cuando haya auth real

    def get(self, request, *args, **kwargs):
        # Lógica temporal: como no sabemos quién llama, retornamos todo temporalmente
        # o asumimos el rol basándonos en si es empresa o institucion.
        # Para el MVP retornamos de manera general o filtramos si hay request.user as Empresa/Institucion
        
        # Ejemplo si el usuario es una Institución:
        # enviadas = SolicitudPasantia.objects.filter(institucion=request.user.institucion)
        # recibidas = ...
        
        # Por ahora devolvemos todas para simulación
        todas_las_solicitudes = SolicitudPasantia.objects.all()
        
        # En un sistema real, separaríamos basándonos en request.user
        recibidas = todas_las_solicitudes # Mock: solicitudes recibidas por esta entidad
        enviadas = todas_las_solicitudes.exclude(id__in=recibidas.values_list('id', flat=True)) # Mock list
        
        # Evitar fallos si la DB está vacía devolviendo arrays vacíos
        data_recibidas = SolicitudPasantiaSerializer(recibidas, many=True).data if recibidas else []
        data_enviadas = SolicitudPasantiaSerializer(enviadas, many=True).data if enviadas else []
        
        return Response({
            "recibidas": data_recibidas,
            "enviadas": data_enviadas,
        })


class SolicitudesRecibidasView(APIView):
    """Retorna solo las solicitudes recibidas."""
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filtro real iría acá basándose en request.user
        solicitudes = SolicitudPasantia.objects.all() 
        data = SolicitudPasantiaSerializer(solicitudes, many=True).data
        return Response(data)


class SolicitudesEnviadasView(APIView):
    """Retorna solo las solicitudes enviadas."""
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filtro real iría acá basándose en request.user
        solicitudes = SolicitudPasantia.objects.none() # Mock list para variar la data
        data = SolicitudPasantiaSerializer(solicitudes, many=True).data
        return Response(data)
