from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.filters import OrderingFilter, SearchFilter

from shared.permissions import IsPlatformAdmin

from .models import AuditoriaEvento
from .serializers import AuditoriaEventoSerializer


class AuditoriaEventosListView(generics.ListAPIView):
    """
    GET /api/audit/events/

    Endpoint de solo lectura para consultar bitácora de auditoría.
    - Filtros: entidad_tipo, entidad_id, accion, realizado_por_usuario
    - Search: email del usuario, nombre de acción, nombre de entidad_tipo
    - Ordering: fecha (desc por defecto)
    """

    serializer_class = AuditoriaEventoSerializer
    permission_classes = [IsPlatformAdmin]

    queryset = (
        AuditoriaEvento.objects.select_related(
            "accion", "entidad_tipo", "realizado_por_usuario"
        )
        .prefetch_related("detalles")
        .all()
    )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["entidad_tipo", "entidad_id", "accion", "realizado_por_usuario"]
    search_fields = [
        "realizado_por_usuario__email",
        "accion__nombre",
        "entidad_tipo__nombre",
    ]
    ordering_fields = ["fecha"]
    ordering = ["-fecha"]