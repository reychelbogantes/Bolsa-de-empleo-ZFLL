"""Serializers for catalogs app."""

from rest_framework import serializers

from . import models


class CatalogoSerializer(serializers.ModelSerializer):
    """Serializer genérico para todos los catálogos."""

    class Meta:
        fields = ["id", "nombre", "activo"]
        read_only_fields = ["id"]
