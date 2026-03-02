"""Institutions app — Institucion, ProgramaFormacion."""
from django.db import models

class Institucion(models.Model):
    usuario = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="institucion")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    tipo_institucion = models.ForeignKey(
        "catalogs.TipoInstitucion",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="instituciones",
        verbose_name="Tipo de institución",
    )
    ubicacion = models.CharField("Ubicación", max_length=255, blank=True)
    activa = models.BooleanField(default=True)
    extra_data = models.JSONField(default=dict, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "instituciones"
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"

    def __str__(self):
        return self.nombre

class ProgramaFormacion(models.Model):
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name="programas")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = "programas_formacion"
        verbose_name = "Programa de formación"

    def __str__(self):
        return f"{self.nombre} ({self.institucion.nombre})"
