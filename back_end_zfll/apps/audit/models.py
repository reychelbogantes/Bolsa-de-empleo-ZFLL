"""
Audit app — Catálogos y registro de auditoría.
Tablas: auditoria_acciones, auditoria_entidades, auditoria_eventos, auditoria_evento_detalles.
"""

from django.db import models


class AuditoriaAccion(models.Model):
    """Catálogo de acciones de auditoría (CREATE, UPDATE, DELETE, APPROVE, REJECT…)."""

    nombre = models.CharField("Nombre", max_length=100, unique=True)

    class Meta:
        db_table = "auditoria_acciones"
        verbose_name = "Acción de auditoría"
        verbose_name_plural = "Acciones de auditoría"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class AuditoriaEntidad(models.Model):
    """Catálogo de entidades auditables (EMPRESA, INSTITUCION, VACANTE, ASPIRANTE…)."""

    nombre = models.CharField("Nombre", max_length=100, unique=True)

    class Meta:
        db_table = "auditoria_entidades"
        verbose_name = "Entidad auditable"
        verbose_name_plural = "Entidades auditables"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class AuditoriaEvento(models.Model):
    """Registro de un evento de auditoría."""

    realizado_por_usuario = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="auditoria_eventos",
        verbose_name="Realizado por",
    )
    entidad_tipo = models.ForeignKey(
        AuditoriaEntidad,
        on_delete=models.CASCADE,
        related_name="eventos",
        verbose_name="Tipo de entidad",
    )
    entidad_id = models.PositiveIntegerField("ID de la entidad")
    accion = models.ForeignKey(
        AuditoriaAccion,
        on_delete=models.CASCADE,
        related_name="eventos",
        verbose_name="Acción",
    )
    fecha = models.DateTimeField("Fecha", auto_now_add=True)

    class Meta:
        db_table = "auditoria_eventos"
        verbose_name = "Evento de auditoría"
        verbose_name_plural = "Eventos de auditoría"
        ordering = ["-fecha"]

    def __str__(self):
        return f"{self.accion} → {self.entidad_tipo}#{self.entidad_id} por {self.realizado_por_usuario}"


class AuditoriaEventoDetalle(models.Model):
    """Detalle campo por campo de cada cambio en un evento de auditoría."""

    auditoria_evento = models.ForeignKey(
        AuditoriaEvento,
        on_delete=models.CASCADE,
        related_name="detalles",
        verbose_name="Evento",
    )
    campo = models.CharField("Campo", max_length=255)
    valor_anterior = models.TextField("Valor anterior", blank=True, null=True)
    valor_nuevo = models.TextField("Valor nuevo", blank=True, null=True)

    class Meta:
        db_table = "auditoria_evento_detalles"
        verbose_name = "Detalle de evento"
        verbose_name_plural = "Detalles de evento"

    def __str__(self):
        return f"{self.campo}: {self.valor_anterior} → {self.valor_nuevo}"
