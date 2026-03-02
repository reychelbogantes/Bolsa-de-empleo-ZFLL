from django.urls import path
from . import views
app_name = "dynamic_forms"
urlpatterns = [
    path("", views.DynamicFieldListView.as_view(), name="dynamicfield-list"),
    path("<int:pk>/", views.DynamicFieldDetailView.as_view(), name="dynamicfield-detail"),
]
