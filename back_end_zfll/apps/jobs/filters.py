"""Filtros para vacantes."""
from django_filters import rest_framework as filters
from .models import Vacante

class VacanteFilter(filters.FilterSet):
    search = filters.CharFilter(field_name="titulo", lookup_expr="icontains")
    class Meta:
        model = Vacante
        fields = ["area_trabajo", "tipo_contrato", "tipo_vacante", "modalidad", "estado_vacante", "empresa"]
