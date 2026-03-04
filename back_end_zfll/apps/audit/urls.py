from django.urls import path

from .views import AuditoriaEventosListView

app_name = "audit"

urlpatterns = [
    path("events/", AuditoriaEventosListView.as_view(), name="audit-events"),
]