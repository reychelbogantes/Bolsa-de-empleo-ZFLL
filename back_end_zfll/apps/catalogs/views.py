"""Views for catalogs app — solo lectura para todos, CRUD para admin."""

from rest_framework import viewsets

from shared.permissions import IsAdminOrReadOnly

from . import models
from .serializers import CatalogoSerializer


def make_catalog_viewset(model_class):
    """Factory para crear un ViewSet por cada catálogo."""

    class CatalogViewSet(viewsets.ModelViewSet):
        queryset = model_class.objects.filter(activo=True)
        serializer_class = type(
            f"{model_class.__name__}Serializer",
            (CatalogoSerializer,),
            {"Meta": type("Meta", (CatalogoSerializer.Meta,), {"model": model_class})},
        )
        permission_classes = [IsAdminOrReadOnly]
        pagination_class = None  # Catálogos son listas pequeñas, no paginar

    CatalogViewSet.__name__ = f"{model_class.__name__}ViewSet"
    return CatalogViewSet


# ViewSets generados dinámicamente
EstadoLaboralViewSet = make_catalog_viewset(models.EstadoLaboral)
EstadoPracticaViewSet = make_catalog_viewset(models.EstadoPractica)
NivelAcademicoViewSet = make_catalog_viewset(models.NivelAcademico)
SectorIndustrialViewSet = make_catalog_viewset(models.SectorIndustrial)
TamanoEmpresaViewSet = make_catalog_viewset(models.TamanoEmpresa)
TipoPuestoViewSet = make_catalog_viewset(models.TipoPuesto)
TipoContratoViewSet = make_catalog_viewset(models.TipoContrato)
TipoVacanteViewSet = make_catalog_viewset(models.TipoVacante)
AreaTrabajoViewSet = make_catalog_viewset(models.AreaTrabajo)
ModalidadViewSet = make_catalog_viewset(models.Modalidad)
EstadoVacanteViewSet = make_catalog_viewset(models.EstadoVacante)
EstadoPostulacionViewSet = make_catalog_viewset(models.EstadoPostulacion)
TipoEventoViewSet = make_catalog_viewset(models.TipoEvento)
MedioNotificacionViewSet = make_catalog_viewset(models.MedioNotificacion)
