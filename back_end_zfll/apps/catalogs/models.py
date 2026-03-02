"""
Catalogs app — Todas las tablas de catálogo (lookup tables).
Editables por admin sin deploy. El frontend las consume para armar dropdowns.
"""

from django.db import models


class CatalogoBase(models.Model):
    """Clase abstracta base para todos los catálogos."""

    nombre = models.CharField("Nombre", max_length=100, unique=True)
    activo = models.BooleanField("Activo", default=True)

    class Meta:
        abstract = True
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


# ─── Catálogos de perfiles ────────────────────

class EstadoLaboral(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "estados_laborales"
        verbose_name = "Estado laboral"
        verbose_name_plural = "Estados laborales"


class EstadoPractica(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "estados_practica"
        verbose_name = "Estado de práctica"
        verbose_name_plural = "Estados de práctica"


class NivelAcademico(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "niveles_academicos"
        verbose_name = "Nivel académico"
        verbose_name_plural = "Niveles académicos"



# ─── Catálogos de instituciones ───────────────

class TipoInstitucion(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tipos_institucion"
        verbose_name = "Tipo de institución"
        verbose_name_plural = "Tipos de institución"


# ─── Catálogos de empresas ────────────────────

class SectorIndustrial(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "sectores_industriales"
        verbose_name = "Sector industrial"
        verbose_name_plural = "Sectores industriales"


class TamanoEmpresa(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tamanos_empresa"
        verbose_name = "Tamaño de empresa"
        verbose_name_plural = "Tamaños de empresa"


# ─── Catálogos de vacantes ────────────────────

class TipoPuesto(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tipos_puesto"
        verbose_name = "Tipo de puesto"
        verbose_name_plural = "Tipos de puesto"


class TipoContrato(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tipos_contrato"
        verbose_name = "Tipo de contrato"
        verbose_name_plural = "Tipos de contrato"


class TipoVacante(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tipos_vacante"
        verbose_name = "Tipo de vacante"
        verbose_name_plural = "Tipos de vacante"


class AreaTrabajo(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "areas_trabajo"
        verbose_name = "Área de trabajo"
        verbose_name_plural = "Áreas de trabajo"


class Modalidad(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "modalidades"
        verbose_name = "Modalidad"
        verbose_name_plural = "Modalidades"


class EstadoVacante(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "estados_vacante"
        verbose_name = "Estado de vacante"
        verbose_name_plural = "Estados de vacante"


# ─── Catálogos de postulaciones ───────────────

class EstadoPostulacion(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "estados_postulacion"
        verbose_name = "Estado de postulación"
        verbose_name_plural = "Estados de postulación"


# ─── Catálogos de notificaciones ──────────────

class TipoEvento(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "tipos_evento"
        verbose_name = "Tipo de evento"
        verbose_name_plural = "Tipos de evento"


class MedioNotificacion(CatalogoBase):
    class Meta(CatalogoBase.Meta):
        db_table = "medios_notificacion"
        verbose_name = "Medio de notificación"
        verbose_name_plural = "Medios de notificación"
