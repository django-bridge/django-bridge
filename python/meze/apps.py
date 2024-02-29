from django.apps import AppConfig


class MezeAppConfig(AppConfig):
    label = "meze"
    name = "meze"
    verbose_name = "Meze"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        # Import forms module to register telepath converters
        from .ui import forms  # noqa
