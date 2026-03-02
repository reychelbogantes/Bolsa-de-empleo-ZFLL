"""CV app — CvVersion (archivos) y Documento (adjuntos)."""
from django.db import models

class CvVersion(models.Model):
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="cv_versiones")
    nombre_etiqueta = models.CharField(max_length=200)
    archivo = models.FileField(upload_to="cv/")
    es_predeterminado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cv_versiones"
        ordering = ["-fecha_creacion"]

    def save(self, *args, **kwargs):
        if self.es_predeterminado:
            CvVersion.objects.filter(usuario=self.usuario, es_predeterminado=True).update(es_predeterminado=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre_etiqueta} ({'★' if self.es_predeterminado else ''})"

class Documento(models.Model):
    TIPO_CHOICES = [("carta_presentacion", "Carta de presentación"), ("certificado", "Certificado"), ("otro", "Otro")]
    usuario = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="documentos")
    tipo_documento = models.CharField(max_length=30, choices=TIPO_CHOICES)
    archivo = models.FileField(upload_to="documentos/")
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "documentos"
