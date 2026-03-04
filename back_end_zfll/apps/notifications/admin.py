"""Admin registration for Notifications models."""
from django.contrib import admin
from .models import Notificacion, PreferenciaNotificacion


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ("usuario", "titulo", "tipo_evento", "medio", "leido", "enviado", "fecha_creacion")
    list_filter = ("leido", "enviado", "tipo_evento", "medio")
    search_fields = ("usuario__email", "titulo", "mensaje")
    readonly_fields = ("fecha_creacion",)
    ordering = ("-fecha_creacion",)


@admin.register(PreferenciaNotificacion)
class PreferenciaNotificacionAdmin(admin.ModelAdmin):
    list_display = ("usuario", "tipo_evento", "medio", "habilitado")
    list_filter = ("habilitado", "tipo_evento", "medio")
    search_fields = ("usuario__email",)
