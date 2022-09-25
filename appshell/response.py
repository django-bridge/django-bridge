from django.contrib import messages
from django.http import JsonResponse
from django.utils.cache import patch_cache_control
from django.utils.html import conditional_escape

from .telepath import JSContext


class BaseAppShellResponse(JsonResponse):
    """
    Base class for all shell responses.
    """

    status = None

    def __init__(self, *args, **kwargs):
        js_context = JSContext()
        data = {
            "status": self.status,
        }
        data.update(js_context.pack(self.get_data(*args, **kwargs)))
        super().__init__(data)
        self["X-Shell-Status"] = self.status

        # Make sure that shell responses are never cached by browsers
        # We need to do this because Shell responses are given on the same URLs that users would otherwise get HTML responses on if they visited those URLs directly.
        # If the shell response is cached, there's a chance that a user could see the JSON document in their browser rather than a HTML page.
        # This behaviour only seems to occur (intermittently) on Firefox.
        patch_cache_control(self, no_store=True)

    def get_data(self):
        return {}


class AppShellResponse(BaseAppShellResponse):
    """
    Instructs the shell to render a view (React component) with the given context.
    """

    status = "render"

    def __init__(
        self, request, *args, supported_modes=None, title="", **kwargs
    ):
        self.request = request
        self.supported_modes = supported_modes or ["browser"]
        self.title = title
        super().__init__(*args, **kwargs)

    def get_mode(self):
        requested_mode = self.request.META.get("HTTP_X_SHELL_MODE", "browser")
        if requested_mode in self.supported_modes:
            return requested_mode

        return "browser"

    def get_data(self, view, context):
        return {
            "view": view,
            "mode": self.get_mode(),
            "title": self.title,
            "context": context,
            "messages": [
                {
                    "level": "error"
                    if message.level == messages.ERROR
                    else "warning"
                    if message.level == messages.WARNING
                    else "success",
                    "html": conditional_escape(message.message),
                }
                for message in messages.get_messages(self.request)
            ],
        }


class AppShellLoadItResponse(BaseAppShellResponse):
    """
    Instructs the appshell to load the view the old-fashioned way.
    """

    status = "load-it"


class AppShellRedirectResponse(BaseAppShellResponse):
    status = "redirect"

    def get_data(self, path):
        return {
            "path": path,
        }


class AppShellCloseModalResponse(BaseAppShellResponse):
    status = "close-modal"


class AppShellNotFoundResponse(BaseAppShellResponse):
    status = "not-found"


class AppShellPermissionDeniedResponse(BaseAppShellResponse):
    status = "permission-denied"
