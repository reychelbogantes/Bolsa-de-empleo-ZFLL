"""
Custom permission classes based on user roles.
All role checks use the M2M roles system (user.has_role()).
"""

from rest_framework.permissions import BasePermission


def _is_admin(user) -> bool:
    """
    Helper interno: devuelve True si el usuario es administrador por cualquier vía:
      1. is_superuser=True  (superusuarios creados con createsuperuser)
      2. is_staff=True      (staff de Django)
      3. rol 'admin' en tabla usuario_roles
      4. rol 'admin_plataforma' en tabla usuario_roles
    """
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser or user.is_staff:
        return True
    if hasattr(user, 'has_role'):
        return user.has_role("admin") or user.has_role("admin_plataforma")
    return False


class IsAspirante(BasePermission):
    """Permite acceso si el usuario tiene el rol 'aspirante'."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_role("aspirante")


class IsPracticante(BasePermission):
    """Permite acceso si el usuario tiene el rol 'practicante'."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_role("practicante")


class IsCandidate(BasePermission):
    """Permite acceso si el usuario es aspirante O practicante."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.has_role("aspirante") or request.user.has_role("practicante")
        )


class IsEmpresa(BasePermission):
    """Permite acceso si el usuario tiene el rol 'empresa'."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_role("empresa")


class IsInstitucion(BasePermission):
    """Permite acceso si el usuario tiene el rol 'institucion'."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_role("institucion")


class IsPlatformAdmin(BasePermission):
    """
    Permite acceso a administradores de la plataforma.
    Acepta superusuarios Django, staff, y usuarios con rol 'admin' o 'admin_plataforma'
    en la tabla usuario_roles.
    """

    def has_permission(self, request, view):
        return _is_admin(request.user)


class IsObjectOwner(BasePermission):
    """
    Permite acceso solo al dueño del objeto.
    El objeto debe tener un campo `usuario` o `user` que sea FK al User.
    """

    def has_object_permission(self, request, view, obj):
        user_field = getattr(obj, "usuario", None) or getattr(obj, "user", None)
        return user_field == request.user


class IsAdminOrReadOnly(BasePermission):
    """Admins pueden escribir; cualquier autenticado puede leer."""

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return _is_admin(request.user)