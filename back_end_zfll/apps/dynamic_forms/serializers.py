from rest_framework import serializers
from .models import DynamicField

class DynamicFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicField
        fields = ["id", "profile_type", "field_name", "field_label",
                  "field_type", "options", "is_required", "is_active", "order"]

    def validate(self, data):
        if data.get("field_type") == "select" and not data.get("options"):
            raise serializers.ValidationError({"options": "Las opciones son requeridas para campos tipo select."})
        return data
