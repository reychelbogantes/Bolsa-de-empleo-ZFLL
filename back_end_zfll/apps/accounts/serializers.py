"""Serializers for accounts app."""

from rest_framework import serializers

from .models import PerfilAspirante, PerfilPracticante, User, Rol, UsuarioRol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ["id", "nombre"]


class UsuarioRolSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source="rol.nombre", read_only=True)

    class Meta:
        model = UsuarioRol
        fields = ["id", "rol", "rol_nombre"]
        read_only_fields = ["id", "rol_nombre"]

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "auth_method",
            "consent_given",
            "is_active",
            "roles",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "roles"]

    def get_roles(self, obj):
        return obj.get_roles()


class PerfilAspiranteSerializer(serializers.ModelSerializer):
    estado_laboral_nombre = serializers.CharField(
        source="estado_laboral.nombre", read_only=True, default=None
    )

    class Meta:
        model = PerfilAspirante
        fields = [
            "id",
            "nombre_completo",
            "resumen_profesional",
            "estado_laboral",
            "estado_laboral_nombre",
            "consentimiento_datos",
            "extra_data",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion"]


class PerfilPracticanteSerializer(serializers.ModelSerializer):
    nivel_academico_nombre = serializers.CharField(
        source="nivel_academico.nombre", read_only=True, default=None
    )
    estado_practica_nombre = serializers.CharField(
        source="estado_practica.nombre", read_only=True, default=None
    )

    class Meta:
        model = PerfilPracticante
        fields = [
            "id",
            "institucion",
            "programa",
            "nivel_academico",
            "nivel_academico_nombre",
            "estado_practica",
            "estado_practica_nombre",
            "periodo_inicio",
            "periodo_fin",
            "horas_requeridas",
            "cargado_por_institucion",
            "extra_data",
            "fecha_creacion",
        ]
        read_only_fields = ["id", "fecha_creacion", "cargado_por_institucion"]

    # Campos “bonitos” para el front
    nombre = serializers.CharField(source="first_name", required=False, allow_blank=True)
    apellido = serializers.CharField(source="last_name", required=False, allow_blank=True)
    correo = serializers.EmailField(source="email")

    # perfil practicante
    institucion_id = serializers.IntegerField(source="perfil_practicante.institucion_id", required=False, allow_null=True)
    programa_id = serializers.IntegerField(source="perfil_practicante.programa_id", required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "correo", "username", "nombre", "apellido", "phone", "institucion_id", "programa_id"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        perfil_data = validated_data.pop("perfil_practicante", {})
        email = validated_data.get("email")
        username = validated_data.get("username") or (email.split("@")[0] if email else None)

        password_temp = self.context["request"].data.get("passTemp") or self.context["request"].data.get("password")
        if not password_temp:
            raise serializers.ValidationError({"passTemp": "Contraseña temporal requerida"})

        user = User.objects.create(
            username=username,
            email=email,
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
        )
        user.set_password(password_temp)
        user.save()

        # asignar rol practicante
        rol = Rol.objects.get(nombre="practicante")
        UsuarioRol.objects.get_or_create(usuario=user, rol=rol)

        # crear/actualizar perfil practicante
        perfil, _ = PerfilPracticante.objects.get_or_create(usuario=user)
        perfil.institucion_id = perfil_data.get("institucion_id") or None
        perfil.programa_id = perfil_data.get("programa_id") or None
        perfil.save()

        return user

    def update(self, instance, validated_data):
        perfil_data = validated_data.pop("perfil_practicante", {})

        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.save()

        # actualizar perfil practicante
        perfil, _ = PerfilPracticante.objects.get_or_create(usuario=instance)
        perfil.institucion_id = perfil_data.get("institucion_id", perfil.institucion_id)
        perfil.programa_id = perfil_data.get("programa_id", perfil.programa_id)
        perfil.save()

        return instance