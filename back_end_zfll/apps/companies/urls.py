from django.urls import path
from . import views

app_name = "companies"

urlpatterns = [
    path("", views.EmpresaListView.as_view(), name="empresa-list"),
    path("me/", views.EmpresaMeView.as_view(), name="empresa-me"),
    path("<int:pk>/", views.EmpresaDetailView.as_view(), name="empresa-detail"),
]