"""
Centralized notification service.

Usage:
    from apps.notifications.services import NotificationService
    NotificationService.create(
        usuario=user,
        tipo_evento_nombre="postulacion_enviada",
        titulo="Postulación enviada",
        mensaje="Tu postulación a Ingeniero de Software fue enviada.",
        url_accion="/mis-postulaciones",
    )
"""
import logging

from apps.catalogs.models import MedioNotificacion, TipoEvento

from .models import Notificacion, PreferenciaNotificacion

logger = logging.getLogger(__name__)


class NotificationService:
    """Create in-app notifications and optionally dispatch email/SMS."""

    @staticmethod
    def create(
        usuario,
        tipo_evento_nombre: str,
        titulo: str,
        mensaje: str,
        data: dict | None = None,
        url_accion: str = "",
    ) -> Notificacion | None:
        """
        Create a notification if the user has not explicitly disabled it.

        Returns the Notificacion instance or None if skipped.
        """
        tipo_evento = TipoEvento.objects.filter(
            nombre=tipo_evento_nombre, activo=True
        ).first()

        if not tipo_evento:
            logger.warning(
                "TipoEvento '%s' not found or inactive — notification skipped.",
                tipo_evento_nombre,
            )
            return None

        # Always create the in-app notification
        notif = Notificacion.objects.create(
            usuario=usuario,
            tipo_evento=tipo_evento,
            titulo=titulo,
            mensaje=mensaje,
            data=data or {},
            url_accion=url_accion,
        )

        # Check preferences and dispatch external channels
        medios = MedioNotificacion.objects.filter(activo=True)
        for medio in medios:
            pref = PreferenciaNotificacion.objects.filter(
                usuario=usuario, tipo_evento=tipo_evento, medio=medio
            ).first()

            # Default: enabled unless explicitly disabled
            habilitado = pref.habilitado if pref else True

            if habilitado:
                NotificationService._dispatch(notif, medio)

        return notif

    @staticmethod
    def _dispatch(notificacion: Notificacion, medio: MedioNotificacion):
        """Dispatch notification through the given medium."""
        nombre = medio.nombre.lower()

        if "correo" in nombre or "email" in nombre:
            try:
                from .tasks import send_email_notification

                send_email_notification(notificacion.id)
            except Exception as exc:
                logger.error("Failed to dispatch email notification: %s", exc)

        elif "celular" in nombre or "sms" in nombre or "telefono" in nombre:
            try:
                from .tasks import send_sms_notification

                send_sms_notification(notificacion.id)
            except Exception as exc:
                logger.error("Failed to dispatch SMS notification: %s", exc)

        else:
            logger.info(
                "Medium '%s' not handled — notification stays in-app only.", nombre
            )

    @staticmethod
    def bulk_create_preferences(usuario):
        """
        Initialize all preference combinations for a user.
        Each (tipo_evento × medio) pair gets a default-enabled preference.
        """
        tipos = TipoEvento.objects.filter(activo=True)
        medios = MedioNotificacion.objects.filter(activo=True)
        created = []

        for tipo in tipos:
            for medio in medios:
                pref, was_created = PreferenciaNotificacion.objects.get_or_create(
                    usuario=usuario,
                    tipo_evento=tipo,
                    medio=medio,
                    defaults={"habilitado": True},
                )
                if was_created:
                    created.append(pref)

        return created
