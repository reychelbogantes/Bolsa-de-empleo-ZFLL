"""Admin registration for audit models."""

from django.contrib import admin

from .models import (
    AuditoriaAccion,
    AuditoriaEntidad,
    AuditoriaEvento,
    AuditoriaEventoDetalle,
)


@admin.register(AuditoriaAccion)
class AuditoriaAccionAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)


@admin.register(AuditoriaEntidad)
class AuditoriaEntidadAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)


class AuditoriaEventoDetalleInline(admin.TabularInline):
    model = AuditoriaEventoDetalle
    extra = 0
    readonly_fields = ("campo", "valor_anterior", "valor_nuevo")


@admin.register(AuditoriaEvento)
class AuditoriaEventoAdmin(admin.ModelAdmin):
    list_display = ("id", "realizado_por_usuario", "entidad_tipo", "entidad_id", "accion", "fecha")
    list_filter = ("accion", "entidad_tipo", "fecha")
    search_fields = ("realizado_por_usuario__email",)
    inlines = [AuditoriaEventoDetalleInline]
    readonly_fields = ("realizado_por_usuario", "entidad_tipo", "entidad_id", "accion", "fecha")
