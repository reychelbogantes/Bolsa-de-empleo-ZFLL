"""
URL configuration for Bolsa de Empleo ZFLL.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Django admin (solo para superusuarios, NO para dashboard)
    path("django-admin/", admin.site.urls),
    # API endpoints por app
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/catalogs/", include("apps.catalogs.urls")),
    path("api/companies/", include("apps.companies.urls")),
    path("api/institutions/", include("apps.institutions.urls")),
    path("api/jobs/", include("apps.jobs.urls")),
    path("api/applications/", include("apps.applications.urls")),
    path("api/cv/", include("apps.cv.urls")),
    path("api/imports/", include("apps.imports.urls")),
    path("api/dynamic-fields/", include("apps.dynamic_forms.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/admin/", include("apps.analytics.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    try:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass
