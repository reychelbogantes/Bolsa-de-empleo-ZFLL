"""URL configuration for catalogs app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "catalogs"

router = DefaultRouter()
router.register("estados-laborales", views.EstadoLaboralViewSet, basename="estado-laboral")
router.register("estados-practica", views.EstadoPracticaViewSet, basename="estado-practica")
router.register("niveles-academicos", views.NivelAcademicoViewSet, basename="nivel-academico")
router.register("sectores-industriales", views.SectorIndustrialViewSet, basename="sector-industrial")
router.register("tamanos-empresa", views.TamanoEmpresaViewSet, basename="tamano-empresa")
router.register("tipos-puesto", views.TipoPuestoViewSet, basename="tipo-puesto")
router.register("tipos-contrato", views.TipoContratoViewSet, basename="tipo-contrato")
router.register("tipos-vacante", views.TipoVacanteViewSet, basename="tipo-vacante")
router.register("areas-trabajo", views.AreaTrabajoViewSet, basename="area-trabajo")
router.register("modalidades", views.ModalidadViewSet, basename="modalidad")
router.register("estados-vacante", views.EstadoVacanteViewSet, basename="estado-vacante")
router.register("estados-postulacion", views.EstadoPostulacionViewSet, basename="estado-postulacion")
router.register("tipos-evento", views.TipoEventoViewSet, basename="tipo-evento")
router.register("medios-notificacion", views.MedioNotificacionViewSet, basename="medio-notificacion")

urlpatterns = [
    path("", include(router.urls)),
]
