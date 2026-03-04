"""Companies app — Empresa, GaleriaEmpresa."""

from django.db import models


class Empresa(models.Model):
    """Perfil de empresa — entidad independiente con FK directo a usuario."""

    usuario = models.OneToOneField(
        "accounts.User", on_delete=models.CASCADE,
        related_name="empresa", verbose_name="Usuario",
    )
    nombre = models.CharField("Nombre", max_length=255)
    cedula_juridica = models.CharField(
        "Cédula jurídica", max_length=50, unique=True, blank=True, null=True,
    )
    descripcion = models.TextField("Descripción", blank=True)
    sector = models.ForeignKey(
        "catalogs.SectorIndustrial", on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name="Sector",
    )
    tamano_empresa = models.ForeignKey(
        "catalogs.TamanoEmpresa", on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name="Tamaño",
    )
    proceso_contratacion = models.TextField("Proceso de contratación", blank=True)
    tiene_url_externa = models.BooleanField("Tiene URL externa", default=False)
    url_externa = models.URLField("URL externa", blank=True)
    foto_perfil = models.ImageField("Foto de perfil", upload_to="empresas/perfil/", blank=True)
    contacto_interesados = models.TextField("Contacto para interesados", blank=True)
    contacto_admin = models.TextField("Contacto administración", blank=True)
    ubicacion = models.CharField("Ubicación", max_length=255, blank=True)
    estado_vacante = models.ForeignKey(
        "catalogs.EstadoVacante", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="empresas",
        verbose_name="Estado de vacante",
    )
    activa = models.BooleanField("Activa", default=False)
    extra_data = models.JSONField("Datos extra", default=dict, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "empresas"
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"

    def __str__(self):
        return self.nombre


class GaleriaEmpresa(models.Model):
    """Fotos adicionales de la empresa."""

    empresa = models.ForeignKey(
        Empresa, on_delete=models.CASCADE, related_name="galeria",
    )
    imagen = models.ImageField("Imagen", upload_to="empresas/galeria/")
    orden = models.PositiveIntegerField("Orden", default=0)

    class Meta:
        db_table = "galeria_empresa"
        ordering = ["orden"]
