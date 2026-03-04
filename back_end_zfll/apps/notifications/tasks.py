"""Notification dispatch tasks.

These are called synchronously for now. If Celery is configured and running,
you can decorate them with @shared_task to make them async.
"""
import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_email_notification(notification_id: int):
    """Send an email for the given notification."""
    from .models import Notificacion

    try:
        notif = Notificacion.objects.select_related("usuario").get(pk=notification_id)
    except Notificacion.DoesNotExist:
        logger.error("Notification %s not found for email dispatch", notification_id)
        return

    user = notif.usuario
    if not user.email:
        logger.warning("User %s has no email — skipping email notification", user.pk)
        return

    subject = notif.titulo or "Notificación — Bolsa de Empleo ZFLL"
    body = notif.mensaje

    if notif.url_accion:
        body += f"\n\nVer más: {notif.url_accion}"

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@lalimafreezone.com"),
            recipient_list=[user.email],
            fail_silently=False,
        )
        notif.enviado = True
        notif.save(update_fields=["enviado"])
        logger.info("Email sent to %s for notification %s", user.email, notification_id)
    except Exception as exc:
        logger.error("Failed sending email to %s: %s", user.email, exc)


def send_sms_notification(notification_id: int):
    """Placeholder for SMS dispatch. Logs the action for now."""
    from .models import Notificacion

    try:
        notif = Notificacion.objects.select_related("usuario").get(pk=notification_id)
    except Notificacion.DoesNotExist:
        logger.error("Notification %s not found for SMS dispatch", notification_id)
        return

    user = notif.usuario
    phone = getattr(user, "phone", None)

    if not phone:
        logger.warning("User %s has no phone — skipping SMS notification", user.pk)
        return

    # TODO: Integrate with an SMS provider (Twilio, etc.)
    logger.info(
        "SMS notification (placeholder) for user %s (%s): %s",
        user.pk,
        phone,
        notif.titulo or notif.mensaje[:60],
    )
