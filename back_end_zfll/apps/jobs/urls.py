from django.urls import path
from . import views
app_name = "jobs"
urlpatterns = [
    path("", views.VacanteListView.as_view(), name="vacante-list"),
    path("<int:pk>/", views.VacanteDetailView.as_view(), name="vacante-detail"),
]
