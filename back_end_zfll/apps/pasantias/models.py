"""Pasantías app — SolicitudPasantia."""
from django.db import models

class SolicitudPasantia(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        REVISADO = "REVISADO", "Revisado"
        APROBADO = "APROBADO", "Aprobado"
        RECHAZADO = "RECHAZADO", "Rechazado"

    institucion = models.ForeignKey(
        "institutions.Institucion", 
        on_delete=models.CASCADE, 
        related_name="solicitudes_pasantia_enviadas"
    )
    empresa = models.ForeignKey(
        "companies.Empresa", 
        on_delete=models.CASCADE, 
        related_name="solicitudes_pasantia_recibidas"
    )
    
    # Campos solicitados por el frontend
    sigla = models.CharField("Sigla Institución", max_length=20)
    cantidad = models.PositiveIntegerField("Cantidad de pasantes", default=1)
    area = models.CharField("Área", max_length=100)
    encargado = models.CharField("Encargado", max_length=255)
    estado = models.CharField(
        "Estado", 
        max_length=20, 
        choices=Estado.choices, 
        default=Estado.PENDIENTE
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "solicitudes_pasantia"
        verbose_name = "Solicitud de Pasantía"
        verbose_name_plural = "Solicitudes de Pasantía"
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return f"{self.sigla} -> {self.empresa.nombre} ({self.area})"
