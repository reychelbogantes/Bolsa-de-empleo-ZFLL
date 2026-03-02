"""Applications app — Postulacion, Historial, Etiquetas."""
from django.db import models

class Etiqueta(models.Model):
    nombre = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#3B82F6")
    class Meta:
        db_table = "etiquetas"
    def __str__(self):
        return self.nombre

class Postulacion(models.Model):
    vacante = models.ForeignKey("jobs.Vacante", on_delete=models.CASCADE, related_name="postulaciones")
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="postulaciones")
    cv_version = models.ForeignKey("cv.CvVersion", on_delete=models.SET_NULL, null=True, blank=True)
    estado_actual = models.ForeignKey("catalogs.EstadoPostulacion", on_delete=models.SET_NULL, null=True)
    visto = models.BooleanField(default=False)
    fecha_postulacion = models.DateTimeField(auto_now_add=True)
    etiquetas = models.ManyToManyField(Etiqueta, through="PostulacionEtiqueta", blank=True)

    class Meta:
        db_table = "postulaciones"
        constraints = [models.UniqueConstraint(fields=["vacante", "usuario"], name="unique_postulacion")]

    def __str__(self):
        return f"{self.usuario} → {self.vacante}"

class HistorialPostulacion(models.Model):
    postulacion = models.ForeignKey(Postulacion, on_delete=models.CASCADE, related_name="historial")
    estado = models.ForeignKey("catalogs.EstadoPostulacion", on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "historial_postulaciones"
        ordering = ["-fecha"]

class PostulacionEtiqueta(models.Model):
    postulacion = models.ForeignKey(Postulacion, on_delete=models.CASCADE)
    etiqueta = models.ForeignKey(Etiqueta, on_delete=models.CASCADE)

    class Meta:
        db_table = "postulacion_etiquetas"
        constraints = [models.UniqueConstraint(fields=["postulacion", "etiqueta"], name="unique_postulacion_etiqueta")]
