"""Signals for accounts app — auto-crear perfiles al asignar roles."""

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import PerfilAspirante, PerfilPracticante, UsuarioRol


@receiver(post_save, sender=UsuarioRol)
def crear_perfil_por_rol(sender, instance, created, **kwargs):
    """Al asignar un rol, crear el perfil correspondiente si no existe."""
    if not created:
        return

    user = instance.usuario
    rol_nombre = instance.rol.nombre

    if rol_nombre == "aspirante":
        PerfilAspirante.objects.get_or_create(usuario=user)
    elif rol_nombre == "practicante":
        PerfilPracticante.objects.get_or_create(usuario=user)
    # empresa e institución se crean desde sus propias apps
