"""Development settings."""

from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Add debug toolbar
INSTALLED_APPS += ["debug_toolbar", "django_extensions"]  # noqa: F405
MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")  # noqa: F405

INTERNAL_IPS = ["127.0.0.1"]

# Show browsable API in dev
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += [  # noqa: F405
    "rest_framework.renderers.BrowsableAPIRenderer",
]

# Email to console in dev
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# CORS allow all in dev
CORS_ALLOW_ALL_ORIGINS = True

# Celery: run tasks synchronously in dev (no Redis/broker needed)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
