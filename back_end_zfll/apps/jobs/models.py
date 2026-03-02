"""Jobs app — Vacante."""
from django.db import models

class Vacante(models.Model):
    empresa = models.ForeignKey("companies.Empresa", on_delete=models.CASCADE, related_name="vacantes")
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    tipo_puesto = models.ForeignKey("catalogs.TipoPuesto", on_delete=models.SET_NULL, null=True, blank=True)
    tipo_contrato = models.ForeignKey("catalogs.TipoContrato", on_delete=models.SET_NULL, null=True, blank=True)
    tipo_vacante = models.ForeignKey("catalogs.TipoVacante", on_delete=models.SET_NULL, null=True, blank=True)
    area_trabajo = models.ForeignKey("catalogs.AreaTrabajo", on_delete=models.SET_NULL, null=True, blank=True)
    modalidad = models.ForeignKey("catalogs.Modalidad", on_delete=models.SET_NULL, null=True, blank=True)
    estado_vacante = models.ForeignKey("catalogs.EstadoVacante", on_delete=models.SET_NULL, null=True, blank=True)
    url_externa = models.URLField(blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_cierre = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "vacantes"
        ordering = ["-fecha_publicacion"]
        indexes = [
            models.Index(fields=["estado_vacante"]),
            models.Index(fields=["area_trabajo"]),
            models.Index(fields=["-fecha_publicacion"]),
        ]

    def __str__(self):
        return self.titulo
