from django.apps import AppConfig


class DjangoRenderAppConfig(AppConfig):
    label = "djrenderrender"
    name = "djrender.render"
    verbose_name = "Django Render"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        # Import forms module to register telepath converters
        from .ui import forms  # noqa
