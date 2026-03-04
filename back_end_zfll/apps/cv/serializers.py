from rest_framework import serializers
from .models import CvVersion, Documento


class CvVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CvVersion
        fields = ["id", "nombre_etiqueta", "archivo", "es_predeterminado", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]


class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = ["id", "tipo_documento", "archivo", "fecha_creacion"]
        read_only_fields = ["id", "fecha_creacion"]


class CvPreviewSerializer(serializers.Serializer):
    """
    Aggregates all user profile data into a single CV-ready payload.
    Called from CvPreviewView — no model binding needed.
    """

    profile = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    languages = serializers.SerializerMethodField()
    certifications = serializers.SerializerMethodField()

    def _extra(self):
        """Shortcut for extra_data from aspirant or user."""
        user = self.instance
        aspirante = getattr(user, "perfil_aspirante", None)
        practicante = getattr(user, "perfil_practicante", None)
        perfil = aspirante or practicante
        extra = {}
        if perfil and hasattr(perfil, "extra_data") and perfil.extra_data:
            extra = perfil.extra_data
        if user.extra_data:
            extra = {**extra, **user.extra_data}
        return perfil, extra

    def get_profile(self, user):
        perfil, extra = self._extra()
        data = {
            "nombre_completo": "",
            "email": user.email,
            "phone": user.phone or "",
            "ubicacion": "",
            "resumen_profesional": "",
            "estado_laboral": "",
        }
        if perfil:
            data["nombre_completo"] = getattr(perfil, "nombre_completo", "") or f"{user.first_name} {user.last_name}".strip()
            data["ubicacion"] = getattr(perfil, "ubicacion", "") or ""
            data["resumen_profesional"] = getattr(perfil, "resumen_profesional", "") or ""

            # Estado laboral
            estado = getattr(perfil, "estado_laboral", None) or getattr(perfil, "estado_practica", None)
            if estado:
                data["estado_laboral"] = str(estado)

        if not data["nombre_completo"]:
            data["nombre_completo"] = f"{user.first_name} {user.last_name}".strip() or user.email

        # Override with extra_data if present
        for key in ("nombre_completo", "ubicacion", "resumen_profesional", "estado_laboral"):
            if extra.get(key):
                data[key] = extra[key]

        return data

    def get_skills(self, user):
        _, extra = self._extra()
        return {
            "hard": extra.get("hard_skills", extra.get("habilidades_tecnicas", [])),
            "soft": extra.get("soft_skills", extra.get("habilidades_blandas", [])),
        }

    def get_education(self, user):
        _, extra = self._extra()
        return extra.get("education", extra.get("formacion", []))

    def get_experience(self, user):
        _, extra = self._extra()
        return extra.get("experience", extra.get("experiencia", []))

    def get_languages(self, user):
        _, extra = self._extra()
        return extra.get("languages", extra.get("idiomas", []))

    def get_certifications(self, user):
        _, extra = self._extra()
        return extra.get("certifications", extra.get("certificaciones", []))

