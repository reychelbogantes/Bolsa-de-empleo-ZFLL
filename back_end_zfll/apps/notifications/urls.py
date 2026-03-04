from django.urls import path

from . import views

app_name = "notifications"

urlpatterns = [
    # Inbox
    path("", views.NotificacionListView.as_view(), name="notificacion-list"),
    path("count/", views.NotificacionCountView.as_view(), name="notificacion-count"),
    path("<int:pk>/read/", views.MarcarLeidaView.as_view(), name="marcar-leida"),
    path("read-all/", views.MarcarTodasLeidasView.as_view(), name="marcar-todas-leidas"),
    path("<int:pk>/delete/", views.NotificacionDeleteView.as_view(), name="notificacion-delete"),
    # Preferences
    path("preferences/", views.PreferenciaListCreateView.as_view(), name="preferencias"),
    path("preferences/<int:pk>/", views.PreferenciaDetailView.as_view(), name="preferencia-detail"),
    path("preferences/bulk/", views.PreferenciaBulkView.as_view(), name="preferencia-bulk"),
    # Company send
    path("send/", views.EnviarNotificacionView.as_view(), name="enviar-notificacion"),
]
