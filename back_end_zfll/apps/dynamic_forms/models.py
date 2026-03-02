"""Dynamic Forms app — DynamicField (campos extra configurables por admin)."""
from django.db import models

class DynamicField(models.Model):
    FIELD_TYPES = [("text", "Texto"), ("select", "Selección"), ("checkbox", "Checkbox"), ("date", "Fecha")]
    profile_type = models.CharField(max_length=20, help_text="aspirante | practicante | empresa | institucion")
    field_name = models.SlugField(max_length=100)
    field_label = models.CharField(max_length=200)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    options = models.JSONField(default=list, blank=True, help_text="Opciones para tipo 'select'")
    is_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "dynamic_fields"
        ordering = ["profile_type", "order"]
        unique_together = ["profile_type", "field_name"]

    def __str__(self):
        return f"{self.profile_type}.{self.field_name}"
