from django.urls import path
from . import views

app_name = "pasantias"
urlpatterns = [
    path("", views.PasantiasDashboardView.as_view(), name="pasantias-dashboard"),
    path("recibidas/", views.SolicitudesRecibidasView.as_view(), name="pasantias-recibidas"),
    path("enviadas/", views.SolicitudesEnviadasView.as_view(), name="pasantias-enviadas"),
]
