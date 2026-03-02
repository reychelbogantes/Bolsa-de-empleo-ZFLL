from django.urls import path
from . import views
app_name = "imports"
urlpatterns = [
    path("", views.LoteImportacionListView.as_view(), name="lote-list"),
    path("upload/", views.LoteImportacionUploadView.as_view(), name="lote-upload"),
    path("<int:pk>/status/", views.LoteImportacionStatusView.as_view(), name="lote-status"),
]
