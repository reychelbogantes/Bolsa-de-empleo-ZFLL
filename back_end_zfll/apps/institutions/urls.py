from django.urls import path
from . import views
app_name = "institutions"
urlpatterns = [
    path("", views.InstitucionListView.as_view(), name="institucion-list"),
    path("<int:pk>/", views.InstitucionDetailView.as_view(), name="institucion-detail"),

    # ✅ Gestión de Usuarios Institucionales
    path("users/", views.InstitucionUsersListCreateView.as_view(), name="inst-users"),
    path("users/<int:pk>/", views.InstitucionUsersDetailView.as_view(), name="inst-users-detail"),

    # ✅ Programas
    path("programas/", views.ProgramasListCreateView.as_view(), name="programas"),
    path("programas/<int:pk>/", views.ProgramasDetailView.as_view(), name="programas-detail"),

    # ✅ Demanda Laboral
    path("demanda-laboral/", views.DemandaLaboralView.as_view(), name="demanda-laboral"),
]