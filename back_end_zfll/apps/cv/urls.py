from django.urls import path
from . import views
app_name = "cv"
urlpatterns = [
    path("", views.CvVersionListCreateView.as_view(), name="cv-list"),
    path("<int:pk>/", views.CvVersionDetailView.as_view(), name="cv-detail"),
    path("documents/", views.DocumentoListCreateView.as_view(), name="documento-list"),
]
