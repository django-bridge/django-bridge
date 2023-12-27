from django.apps import AppConfig


class DjreamAppConfig(AppConfig):
    label = "djream"
    name = "djream"
    verbose_name = "Djream"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        import djream.ui.forms  # noqa
