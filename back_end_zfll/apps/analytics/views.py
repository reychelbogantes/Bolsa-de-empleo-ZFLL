"""Analytics app — Admin dashboard, stats, reportes."""
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User, UsuarioRol
from apps.applications.models import Postulacion
from apps.jobs.models import Vacante
from shared.permissions import IsPlatformAdmin


class DashboardStatsView(APIView):
    """GET /api/admin/stats/ — estadísticas agregadas."""
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        stats = {
            "usuarios_total": User.objects.filter(is_active=True).count(),
            "usuarios_por_rol": list(
                UsuarioRol.objects.values("rol__nombre").annotate(total=Count("id"))
            ),
            "vacantes_activas": Vacante.objects.filter(estado_vacante__nombre="activa").count(),
            "postulaciones_total": Postulacion.objects.count(),
        }
        return Response(stats)
