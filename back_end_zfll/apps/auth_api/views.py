import base64
import json
import secrets

from django.apps import apps as django_apps
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    CheckUserSerializer,
    ValidateEmailSerializer,
    LoginSerializer,
    LoginOrgSerializer,
    RegisterAspiranteSerializer,
    RegisterEmpresaSerializer,
    RegisterInstitucionSerializer,
    GoogleLoginSerializer,
)


User = get_user_model()

# ── IDs de roles según tabla de la BD ────────────────────────
# 1=aspirante | 2=empresa | 3=institucion | 4=admin | 6=pasante
ROL_IDS = {
    "aspirante":   1,
    "empresa":     2,
    "institucion": 3,
    "admin":       4,
    "pasante":     6,
}


def _jwt_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def _decode_google_jwt_payload(token: str) -> dict:
    try:
        parts = token.split(".")
        if len(parts) < 2:
            return {}
        payload_b64 = parts[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        decoded = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        return json.loads(decoded.decode("utf-8"))
    except Exception:
        return {}


def _set_user_role(user, role_name: str):
    """
    Inserta en tabla usuario_roles usando el ID fijo de la tabla roles.
    """
    rol_id = ROL_IDS.get(role_name)
    if not rol_id:
        return
    try:
        UsuarioRol = django_apps.get_model("accounts", "UsuarioRol")
        Rol        = django_apps.get_model("accounts", "Rol")
        rol_obj    = Rol.objects.get(id=rol_id)
        UsuarioRol.objects.get_or_create(usuario=user, rol=rol_obj)
    except Exception:
        if hasattr(user, "add_role"):
            try:
                user.add_role(role_name)
            except Exception:
                pass


def _get_user_role_name(user) -> str | None:
    """
    Obtiene el nombre del primer rol del usuario desde usuario_roles.
    """
    try:
        ur = user.usuario_roles.select_related("rol").first()
        if ur:
            return ur.rol.nombre
    except Exception:
        pass
    return None


def _safe_user_create(email: str, password: str, nombre: str = "", phone: str = ""):
    """
    Crea usuario con create_user() para manejar hash y campos requeridos.
    USERNAME_FIELD="email", REQUIRED_FIELDS=["username"] en el modelo.
    """
    extra = {}
    if nombre:
        if "first_name" in [f.name for f in User._meta.fields]:
            extra["first_name"] = nombre
    if phone:
        if "phone" in [f.name for f in User._meta.fields]:
            extra["phone"] = phone
        elif "telefono" in [f.name for f in User._meta.fields]:
            extra["telefono"] = phone

    return User.objects.create_user(
        username=email,
        email=email,
        password=password,
        **extra
    )


def _ensure_org_entity(user, role_name: str, payload: dict):
    if role_name == "empresa":
        Empresa = None
        try:
            Empresa = django_apps.get_model("companies", "Empresa")
        except Exception:
            try:
                Empresa = django_apps.get_model("empresas", "Empresa")
            except Exception:
                Empresa = None

        if not Empresa:
            return {"warning": "No se encontró el modelo Empresa."}

        data = {}
        if payload.get("nombre_empresa"):
            if "nombre" in [f.name for f in Empresa._meta.fields]:
                data["nombre"] = payload["nombre_empresa"]
        if payload.get("ubicacion"):
            if "ubicacion" in [f.name for f in Empresa._meta.fields]:
                data["ubicacion"] = payload["ubicacion"]
        if payload.get("cedula_juridica"):
            if "cedula_juridica" in [f.name for f in Empresa._meta.fields]:
                data["cedula_juridica"] = payload["cedula_juridica"]
        for fk in ["usuario", "user", "creado_por", "owner"]:
            if fk in [f.name for f in Empresa._meta.fields]:
                data[fk] = user
                break
        if data:
            Empresa.objects.get_or_create(**data)
        return {}

    if role_name == "institucion":
        Institucion = None
        try:
            Institucion = django_apps.get_model("institutions", "Institucion")
        except Exception:
            try:
                Institucion = django_apps.get_model("instituciones", "Institucion")
            except Exception:
                Institucion = None

        if not Institucion:
            return {"warning": "No se encontró el modelo Institucion."}

        data = {}
        if payload.get("nombre_institucion"):
            if "nombre" in [f.name for f in Institucion._meta.fields]:
                data["nombre"] = payload["nombre_institucion"]
        if payload.get("ubicacion"):
            if "ubicacion" in [f.name for f in Institucion._meta.fields]:
                data["ubicacion"] = payload["ubicacion"]
        if payload.get("cedula_juridica"):
            if "cedula_juridica" in [f.name for f in Institucion._meta.fields]:
                data["cedula_juridica"] = payload["cedula_juridica"]
            elif "extra_data" in [f.name for f in Institucion._meta.fields]:
                data["extra_data"] = {"cedula_juridica": payload["cedula_juridica"]}
        for fk in ["usuario", "user", "creado_por", "owner"]:
            if fk in [f.name for f in Institucion._meta.fields]:
                data[fk] = user
                break
        if data:
            Institucion.objects.get_or_create(**data)
        return {}

    return {}


# ── Views ─────────────────────────────────────────────────────

class CheckUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = CheckUserSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email_normalized"]
        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists, "email": email}, status=status.HTTP_200_OK)


class ValidateEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = ValidateEmailSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email_normalized"]

        qs = User.objects.filter(email=email)
        if not qs.exists():
            return Response({"valid": False, "reason": "NOT_FOUND"}, status=status.HTTP_200_OK)

        user      = qs.first()
        role_name = _get_user_role_name(user)
        is_org    = role_name in ["empresa", "institucion"]

        return Response(
            {"valid": True, "email": email, "is_org": is_org, "role": role_name},
            status=status.HTTP_200_OK
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        email    = ser.validated_data["email_normalized"]
        password = ser.validated_data["password_normalized"]

        user = authenticate(request, username=email, password=password)
        if user is None:
            user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"detail": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        tokens    = _jwt_for_user(user)
        roles     = user.get_roles()
        role_name = roles[0] if roles else None

        return Response(
            {
                "user": {
                    "id":    user.id,
                    "email": user.email,
                    "role":  role_name,
                    "roles": roles,
                    "name":  getattr(user, "first_name", "") or "",
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK
        )


class LoginOrgView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = LoginOrgSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        email    = ser.validated_data["email_normalized"]
        password = ser.validated_data["password_normalized"]

        user = authenticate(request, username=email, password=password)
        if user is None:
            user = authenticate(request, email=email, password=password)
        if user is None:
            return Response({"detail": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        tokens    = _jwt_for_user(user)
        roles     = user.get_roles()
        role_name = roles[0] if roles else None

        return Response(
            {
                "user": {
                    "id":    user.id,
                    "email": user.email,
                    "role":  role_name,
                    "roles": roles,
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK
        )


class RegisterAspiranteView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        ser = RegisterAspiranteSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        email = data["email"]
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Este correo ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        user = _safe_user_create(
            email=email,
            password=data["password"],
            nombre=data.get("nombre", ""),
            phone=data.get("phone", ""),
        )
        # ✅ Asigna rol aspirante ID=1
        _set_user_role(user, "aspirante")

        tokens = _jwt_for_user(user)
        return Response(
            {"user_id": user.id, "email": email, "tokens": tokens, "role": "aspirante"},
            status=status.HTTP_201_CREATED
        )


class RegisterEmpresaView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        ser = RegisterEmpresaSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        email = data["email"]
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Este correo ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        user = _safe_user_create(
            email=email,
            password=data["password"],
            nombre=data.get("nombre", ""),
            phone=data.get("phone", ""),
        )
        # ✅ Asigna rol empresa ID=2
        _set_user_role(user, "empresa")
        org_info = _ensure_org_entity(user, "empresa", data)

        tokens = _jwt_for_user(user)
        resp = {"user_id": user.id, "email": email, "tokens": tokens, "role": "empresa"}
        resp.update(org_info)
        return Response(resp, status=status.HTTP_201_CREATED)


class RegisterInstitucionView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        ser = RegisterInstitucionSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        email = data["email"]
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Este correo ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

        user = _safe_user_create(
            email=email,
            password=data["password"],
            nombre=data.get("nombre", ""),
            phone=data.get("phone", ""),
        )
        # ✅ Asigna rol institucion ID=3
        _set_user_role(user, "institucion")
        org_info = _ensure_org_entity(user, "institucion", data)

        tokens = _jwt_for_user(user)
        resp = {"user_id": user.id, "email": email, "tokens": tokens, "role": "institucion"}
        resp.update(org_info)
        return Response(resp, status=status.HTTP_201_CREATED)


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = GoogleLoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        payload = _decode_google_jwt_payload(ser.validated_data["credential"])
        email   = (payload.get("email") or "").strip().lower()

        if not email:
            return Response({"detail": "No se pudo leer el email del token."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
        else:
            # ✅ secrets.token_urlsafe reemplaza make_random_password() eliminado en Django 5
            user = _safe_user_create(
                email=email,
                password=secrets.token_urlsafe(20),
                nombre=payload.get("name", ""),
                phone="",
            )
            # Google solo aplica para aspirantes → ID=1
            _set_user_role(user, "aspirante")

        tokens    = _jwt_for_user(user)
        roles     = user.get_roles()
        role_name = roles[0] if roles else None

        return Response(
            {
                "user": {
                    "id":    user.id,
                    "email": user.email,
                    "role":  role_name,
                    "roles": roles,
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK
        )