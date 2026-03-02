"""Shared mixins for serializers and views."""


class ValidateDynamicFieldsMixin:
    """
    Mixin para validar extra_data contra DynamicField activos.
    Se usa en los serializers de perfiles (aspirante, practicante, etc.).
    Implementación completa en E6-2.
    """

    def validate_extra_data(self, profile_type, data):
        # TODO: Implementar en E6-2
        return data
