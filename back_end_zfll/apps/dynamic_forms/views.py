from rest_framework import generics
from shared.permissions import IsAdminOrReadOnly
from .models import DynamicField
from .serializers import DynamicFieldSerializer

class DynamicFieldListView(generics.ListCreateAPIView):
    """GET /api/dynamic-fields/?profile_type=practicante — público para frontend, CRUD para admin."""
    serializer_class = DynamicFieldSerializer
    permission_classes = [IsAdminOrReadOnly]
    def get_queryset(self):
        qs = DynamicField.objects.filter(is_active=True)
        profile_type = self.request.query_params.get("profile_type")
        if profile_type:
            qs = qs.filter(profile_type=profile_type)
        return qs

class DynamicFieldDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DynamicField.objects.all()
    serializer_class = DynamicFieldSerializer
    permission_classes = [IsAdminOrReadOnly]
