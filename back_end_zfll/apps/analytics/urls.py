from django.urls import path
from . import views
app_name = "analytics"
urlpatterns = [
    path("stats/", views.DashboardStatsView.as_view(), name="dashboard-stats"),
]
