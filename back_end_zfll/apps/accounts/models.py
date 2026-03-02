"""
Accounts app — User model, roles M2M, perfiles (aspirante, practicante).
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    User base extendido. Los roles se manejan vía M2M con la tabla Rol.
    Auth: email/password, telefono+OTP, Google OAuth.
    """

    class AuthMethod(models.TextChoices):
        EMAIL = "email", "Email"
        PHONE = "phone", "Teléfono"
        GOOGLE = "google", "Google"

    # Override email to enforce uniqueness (required when used as USERNAME_FIELD)
    email = models.EmailField("Correo electrónico", unique=True)

    phone = models.CharField("Teléfono", max_length=20, blank=True, null=True)
    auth_method = models.CharField(
        "Método de autenticación",
        max_length=10,
        choices=AuthMethod.choices,
        default=AuthMethod.EMAIL,
    )
    consent_given = models.BooleanField("Consentimiento otorgado", default=False)
    consent_date = models.DateTimeField("Fecha de consentimiento", blank=True, null=True)
    is_active = models.BooleanField("Activo", default=True)
    soft_deleted = models.BooleanField("Eliminado (soft)", default=False)
    extra_data = models.JSONField("Datos extra", default=dict, blank=True)
    created_at = models.DateTimeField("Fecha de creación", auto_now_add=True)
    updated_at = models.DateTimeField("Última actualización", auto_now=True)

    # Override: usamos email como login principal
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "usuarios"
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.email or self.username

    # ─── Helpers de roles ─────────────────────────
    def has_role(self, role_name: str) -> bool:
        """Verifica si el usuario tiene un rol específico."""
        return self.usuario_roles.filter(rol__nombre=role_name).exists()

    def get_roles(self) -> list[str]:
        """Devuelve lista de nombres de roles del usuario."""
        return list(self.usuario_roles.values_list("rol__nombre", flat=True))

    def add_role(self, role_name: str):
        """Asigna un rol al usuario (crea UsuarioRol)."""
        rol = Rol.objects.get(nombre=role_name)
        UsuarioRol.objects.get_or_create(usuario=self, rol=rol)

    def remove_role(self, role_name: str):
        """Quita un rol al usuario."""
        self.usuario_roles.filter(rol__nombre=role_name).delete()


class Rol(models.Model):
    """Tabla de roles del sistema."""

    nombre = models.CharField("Nombre del rol", max_length=20, unique=True)

    class Meta:
        db_table = "roles"
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre


class UsuarioRol(models.Model):
    """Tabla intermedia M2M entre Usuario y Rol."""

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="usuario_roles",
        verbose_name="Usuario",
    )
    rol = models.ForeignKey(
        Rol,
        on_delete=models.CASCADE,
        related_name="usuario_roles",
        verbose_name="Rol",
    )
    assigned_at = models.DateTimeField("Fecha de asignación", auto_now_add=True)

    class Meta:
        db_table = "usuario_roles"
        verbose_name = "Rol de usuario"
        verbose_name_plural = "Roles de usuario"
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "rol"],
                name="unique_usuario_rol",
            )
        ]

    def __str__(self):
        return f"{self.usuario} → {self.rol}"


class PerfilAspirante(models.Model):
    """Perfil para usuarios con rol 'aspirante'."""

    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="perfil_aspirante",
        verbose_name="Usuario",
    )
    nombre_completo = models.CharField("Nombre completo", max_length=255, blank=True)
    resumen_profesional = models.TextField("Resumen profesional", blank=True)
    ubicacion = models.CharField("Ubicación", max_length=255, blank=True)
    estado_laboral = models.ForeignKey(
        "catalogs.EstadoLaboral",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="aspirantes",
        verbose_name="Estado laboral",
    )
    consentimiento_datos = models.BooleanField("Consentimiento de datos", default=False)
    fecha_consentimiento = models.DateTimeField(
        "Fecha de consentimiento", blank=True, null=True
    )
    extra_data = models.JSONField("Datos extra", default=dict, blank=True)
    fecha_creacion = models.DateTimeField("Fecha de creación", auto_now_add=True)

    class Meta:
        db_table = "perfiles_aspirantes"
        verbose_name = "Perfil de aspirante"
        verbose_name_plural = "Perfiles de aspirantes"

    def __str__(self):
        return f"Aspirante: {self.nombre_completo or self.usuario.email}"


class PerfilPracticante(models.Model):
    """Perfil para usuarios con rol 'practicante'."""

    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="perfil_practicante",
        verbose_name="Usuario",
    )
    institucion = models.ForeignKey(
        "institutions.Institucion",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="practicantes",
        verbose_name="Institución",
    )
    programa = models.ForeignKey(
        "institutions.ProgramaFormacion",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="practicantes",
        verbose_name="Programa de formación",
    )
    nivel_academico = models.ForeignKey(
        "catalogs.NivelAcademico",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="practicantes",
        verbose_name="Nivel académico",
    )
    estado_practica = models.ForeignKey(
        "catalogs.EstadoPractica",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="practicantes",
        verbose_name="Estado de práctica",
    )
    periodo_inicio = models.DateField("Periodo inicio", blank=True, null=True)
    periodo_fin = models.DateField("Periodo fin", blank=True, null=True)
    horas_requeridas = models.PositiveIntegerField("Horas requeridas", default=0)
    cargado_por_institucion = models.BooleanField(
        "Cargado por institución", default=False
    )
    extra_data = models.JSONField("Datos extra", default=dict, blank=True)
    fecha_creacion = models.DateTimeField("Fecha de creación", auto_now_add=True)

    class Meta:
        db_table = "perfiles_practicantes"
        verbose_name = "Perfil de practicante"
        verbose_name_plural = "Perfiles de practicantes"

    def __str__(self):
        return f"Practicante: {self.usuario.email}"
