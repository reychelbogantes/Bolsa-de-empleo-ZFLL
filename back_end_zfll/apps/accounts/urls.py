"""URL configuration for accounts app."""

from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    # ── Perfil propio ─────────────────────────────────────────
    path("me/", views.UserMeView.as_view(), name="user-me"),
    path("egresados/", views.EgresadosInstitucionListView.as_view(), name="egresados-institucion"),
    path(
        "profile/aspirante/",
        views.PerfilAspiranteView.as_view(),
        name="perfil-aspirante",
    ),
    path(
        "profile/practicante/",
        views.PerfilPracticanteView.as_view(),
        name="perfil-practicante",
    ),
    path(
        "profile/switch-rol/",
        views.SwitchRolView.as_view(),
        name="switch-rol",
    ),

    # ── Admin: gestión de usuarios ────────────────────────────
    # GET  /api/accounts/admin/users/?role=aspirante  → lista de usuarios por rol
    # GET  /api/accounts/admin/users/{id}/            → detalle
    # PATCH /api/accounts/admin/users/{id}/           → actualizar
    # DELETE /api/accounts/admin/users/{id}/          → soft delete
    path(
        "admin/users/",
        views.AdminUserListView.as_view(),
        name="admin-user-list",
    ),
    path(
        "admin/users/<int:pk>/",
        views.AdminUserDetailView.as_view(),
        name="admin-user-detail",
    ),
]
