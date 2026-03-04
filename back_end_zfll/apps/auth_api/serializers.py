from rest_framework import serializers


class CheckUserSerializer(serializers.Serializer):
    correo = serializers.EmailField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False, allow_blank=False)
    tipo = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        correo = data.get("correo") or data.get("email")
        if not correo:
            raise serializers.ValidationError("Debe enviar 'correo' o 'email'.")
        data["email_normalized"] = correo.strip().lower()
        return data


class ValidateEmailSerializer(serializers.Serializer):
    correo = serializers.EmailField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False, allow_blank=False)

    def validate(self, data):
        correo = data.get("correo") or data.get("email")
        if not correo:
            raise serializers.ValidationError("Debe enviar 'correo' o 'email'.")
        data["email_normalized"] = correo.strip().lower()
        return data


class LoginSerializer(serializers.Serializer):
    # Soporta ambos contratos (frontend inconsistente)
    correo = serializers.EmailField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False, allow_blank=False)
    contrasena = serializers.CharField(required=False, allow_blank=False, write_only=True)
    password = serializers.CharField(required=False, allow_blank=False, write_only=True)

    # extras que tu frontend manda
    tipo = serializers.CharField(required=False, allow_blank=True)
    subrole = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        email = (data.get("correo") or data.get("email") or "").strip().lower()
        password = data.get("contrasena") or data.get("password")

        if not email:
            raise serializers.ValidationError("Falta 'correo' o 'email'.")
        if not password:
            raise serializers.ValidationError("Falta 'contrasena' o 'password'.")

        data["email_normalized"] = email
        data["password_normalized"] = password
        return data


class LoginOrgSerializer(LoginSerializer):
    # alias del login (tu frontend usa /login-org/)
    pass


class RegisterBaseSerializer(serializers.Serializer):
    nombre = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        data["email"] = data["email"].strip().lower()
        return data


class RegisterAspiranteSerializer(RegisterBaseSerializer):
    # campos extra típicos (si no vienen, no pasa nada)
    identificacion = serializers.CharField(required=False, allow_blank=True)
    ubicacion = serializers.CharField(required=False, allow_blank=True)


class RegisterEmpresaSerializer(RegisterBaseSerializer):
    cedula_juridica = serializers.CharField(required=False, allow_blank=True)
    ubicacion = serializers.CharField(required=False, allow_blank=True)
    nombre_empresa = serializers.CharField(required=False, allow_blank=True)


class RegisterInstitucionSerializer(RegisterBaseSerializer):
    cedula_juridica = serializers.CharField(required=False, allow_blank=True)
    ubicacion = serializers.CharField(required=False, allow_blank=True)
    nombre_institucion = serializers.CharField(required=False, allow_blank=True)


class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField(required=True)
    tipo = serializers.CharField(required=False, allow_blank=True)  # opcional
    subrole = serializers.CharField(required=False, allow_blank=True)