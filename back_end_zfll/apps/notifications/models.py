"""Notifications app — Notificacion, PreferenciaNotificacion."""
from django.db import models

class Notificacion(models.Model):
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notificaciones")
    tipo_evento = models.ForeignKey("catalogs.TipoEvento", on_delete=models.SET_NULL, null=True)
    medio = models.ForeignKey("catalogs.MedioNotificacion", on_delete=models.SET_NULL, null=True)
    mensaje = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    leido = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notificaciones"
        ordering = ["-fecha_creacion"]

class PreferenciaNotificacion(models.Model):
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="preferencias_notificacion")
    tipo_evento = models.ForeignKey("catalogs.TipoEvento", on_delete=models.CASCADE)
    medio = models.ForeignKey("catalogs.MedioNotificacion", on_delete=models.CASCADE)
    habilitado = models.BooleanField(default=True)

    class Meta:
        db_table = "preferencias_notificacion"
        unique_together = ["usuario", "tipo_evento", "medio"]
