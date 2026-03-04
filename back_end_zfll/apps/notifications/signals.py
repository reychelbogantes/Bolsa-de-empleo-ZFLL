"""
Signals for automatic notification dispatch.

Connected events:
- Postulacion created → notify aspirant + company
- HistorialPostulacion created → notify aspirant of status change
"""
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)


@receiver(post_save, sender="applications.Postulacion")
def on_postulacion_created(sender, instance, created, **kwargs):
    """Notify both the aspirant and the company when a new application is submitted."""
    if not created:
        return

    from .services import NotificationService

    postulacion = instance
    vacante_titulo = str(postulacion.vacante) if postulacion.vacante_id else "una vacante"

    # 1) Notify the aspirant
    NotificationService.create(
        usuario=postulacion.usuario,
        tipo_evento_nombre="postulacion_enviada",
        titulo="Postulación enviada",
        mensaje=f"Tu postulación a \"{vacante_titulo}\" fue registrada exitosamente.",
        data={"postulacion_id": postulacion.pk},
        url_accion="/mis-postulaciones",
    )

    # 2) Notify the company owner
    try:
        empresa = postulacion.vacante.empresa
        if hasattr(empresa, "usuario") and empresa.usuario:
            NotificationService.create(
                usuario=empresa.usuario,
                tipo_evento_nombre="nueva_postulacion",
                titulo="Nueva postulación recibida",
                mensaje=f"Se recibió una postulación para \"{vacante_titulo}\".",
                data={
                    "postulacion_id": postulacion.pk,
                    "vacante_id": postulacion.vacante_id,
                },
            )
    except Exception as exc:
        logger.warning("Could not notify company for postulacion %s: %s", postulacion.pk, exc)


@receiver(post_save, sender="applications.HistorialPostulacion")
def on_estado_postulacion_changed(sender, instance, created, **kwargs):
    """Notify the aspirant when their application status changes."""
    if not created:
        return

    from .services import NotificationService

    historial = instance
    postulacion = historial.postulacion
    estado_nombre = str(historial.estado) if historial.estado_id else "actualizado"
    vacante_titulo = str(postulacion.vacante) if postulacion.vacante_id else "una vacante"

    NotificationService.create(
        usuario=postulacion.usuario,
        tipo_evento_nombre="cambio_estado_postulacion",
        titulo="Estado de postulación actualizado",
        mensaje=f"Tu postulación a \"{vacante_titulo}\" cambió a: {estado_nombre}.",
        data={
            "postulacion_id": postulacion.pk,
            "nuevo_estado": estado_nombre,
        },
        url_accion="/mis-postulaciones",
    )
