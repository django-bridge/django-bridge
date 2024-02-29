from django.apps import AppConfig


class MezeRenderAppConfig(AppConfig):
    label = "mezerender"
    name = "meze.render"
    verbose_name = "Meze"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        # Import forms module to register telepath converters
        from .ui import forms  # noqa
