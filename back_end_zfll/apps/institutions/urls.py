from django.urls import path
from . import views
app_name = "institutions"
urlpatterns = [
    path("", views.InstitucionListView.as_view(), name="institucion-list"),
    path("<int:pk>/", views.InstitucionDetailView.as_view(), name="institucion-detail"),
]
