"""Celery configuration for Bolsa de Empleo ZFLL."""

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("bolsa_empleo")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
