"""URL configuration for accounts app."""

from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("me/", views.UserMeView.as_view(), name="user-me"),
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
]
