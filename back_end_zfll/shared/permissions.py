"""
Custom permission classes based on user roles.
All role checks use the M2M roles system (user.has_role()).
Never use is_staff for business logic.
"""

from rest_framework.permissions import BasePermission


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
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.has_role("admin") or request.user.has_role("admin_plataforma")
        )



class IsObjectOwner(BasePermission):
    """
    Permite acceso solo al dueño del objeto.
    El objeto debe tener un campo `usuario` o `user` que sea FK al User.
    """

    def has_object_permission(self, request, view, obj):
        user_field = getattr(obj, "usuario", None) or getattr(obj, "user", None)
        return user_field == request.user


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return request.user.has_role("admin") or request.user.has_role("admin_plataforma")
