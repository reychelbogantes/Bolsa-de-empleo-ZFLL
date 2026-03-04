from django.urls import path
from .views import (
    CheckUserView,
    ValidateEmailView,
    LoginView,
    LoginOrgView,
    RegisterAspiranteView,
    RegisterEmpresaView,
    RegisterInstitucionView,
    GoogleLoginView,
)

urlpatterns = [
    path("check-user/", CheckUserView.as_view(), name="auth-check-user"),
    path("validate-email/", ValidateEmailView.as_view(), name="auth-validate-email"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("login-org/", LoginOrgView.as_view(), name="auth-login-org"),

    path("register/aspirante/", RegisterAspiranteView.as_view(), name="auth-register-aspirante"),
    path("register/empresa/", RegisterEmpresaView.as_view(), name="auth-register-empresa"),
    path("register/institucion/", RegisterInstitucionView.as_view(), name="auth-register-institucion"),

    path("google/", GoogleLoginView.as_view(), name="auth-google"),
]