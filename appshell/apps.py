from django.apps import AppConfig


class AppShellAppConfig(AppConfig):
    label = "appshell"
    name = "appshell"
    verbose_name = "Django React AppShell"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        import appshell.ui.forms  # noqa
