"""Imports app — ImportBatch, EstudianteImportado."""
from django.db import models

class LoteImportacion(models.Model):
    STATUS_CHOICES = [("processing", "Procesando"), ("completed", "Completado"), ("completed_with_errors", "Con errores")]
    institucion = models.ForeignKey("institutions.Institucion", on_delete=models.CASCADE, related_name="lotes")
    subido_por = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    archivo = models.FileField(upload_to="imports/")
    estado = models.CharField(max_length=25, choices=STATUS_CHOICES, default="processing")
    log_errores = models.JSONField(default=list, blank=True)
    total_registros = models.IntegerField(default=0)
    creados = models.IntegerField(default=0)
    actualizados = models.IntegerField(default=0)
    con_error = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "lotes_importacion"
        ordering = ["-fecha_subida"]

class EstudianteImportado(models.Model):
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="importaciones")
    lote = models.ForeignKey(LoteImportacion, on_delete=models.SET_NULL, null=True, related_name="estudiantes")

    class Meta:
        db_table = "estudiantes_importados"
