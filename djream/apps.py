from django.apps import AppConfig


class DjreamAppConfig(AppConfig):
    label = "djream"
    name = "djream"
    verbose_name = "Djream"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        # Import forms module to register telepath converters
        from .ui import forms  # noqa
