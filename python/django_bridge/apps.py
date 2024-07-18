from django.apps import AppConfig
from django.utils.module_loading import autodiscover_modules


class DjangoBridgeAppConfig(AppConfig):
    label = "django_bridge"
    name = "django_bridge"
    verbose_name = "Django Bridge"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        autodiscover_modules("adapters")
