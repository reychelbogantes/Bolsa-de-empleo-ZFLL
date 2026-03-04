"""Notifications app — Notificacion, PreferenciaNotificacion."""
from django.db import models


class Notificacion(models.Model):
    usuario = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="notificaciones"
    )
    tipo_evento = models.ForeignKey(
        "catalogs.TipoEvento", on_delete=models.SET_NULL, null=True, blank=True
    )
    medio = models.ForeignKey(
        "catalogs.MedioNotificacion", on_delete=models.SET_NULL, null=True, blank=True
    )
    titulo = models.CharField("Título", max_length=255, default="")
    mensaje = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    url_accion = models.CharField(
        "URL de acción", max_length=500, blank=True, default=""
    )
    leido = models.BooleanField(default=False)
    enviado = models.BooleanField("Enviado (email/SMS)", default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notificaciones"
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return f"[{self.usuario}] {self.titulo or self.mensaje[:40]}"


class PreferenciaNotificacion(models.Model):
    usuario = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="preferencias_notificacion",
    )
    tipo_evento = models.ForeignKey("catalogs.TipoEvento", on_delete=models.CASCADE)
    medio = models.ForeignKey("catalogs.MedioNotificacion", on_delete=models.CASCADE)
    habilitado = models.BooleanField(default=True)

    class Meta:
        db_table = "preferencias_notificacion"
        unique_together = ["usuario", "tipo_evento", "medio"]

    def __str__(self):
        estado = "✓" if self.habilitado else "✗"
        return f"{self.usuario} | {self.tipo_evento} | {self.medio} [{estado}]"
