from django.urls import path
from . import views
app_name = "notifications"
urlpatterns = [
    path("", views.NotificacionListView.as_view(), name="notificacion-list"),
    path("<int:pk>/read/", views.MarcarLeidaView.as_view(), name="marcar-leida"),
    path("read-all/", views.MarcarTodasLeidasView.as_view(), name="marcar-todas-leidas"),
    path("preferences/", views.PreferenciaListView.as_view(), name="preferencias"),
]
