from django.urls import path
from . import views
app_name = "applications"
urlpatterns = [
    path("my/", views.MisPostulacionesView.as_view(), name="mis-postulaciones"),
]
