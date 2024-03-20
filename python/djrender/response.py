from django.conf import settings
from django.contrib import messages
from django.http import JsonResponse
from django.utils.cache import patch_cache_control
from django.utils.html import conditional_escape
from django.utils.module_loading import import_string

from .telepath import JSContext


def get_messages(request):
    return [
        {
            "level": (
                "error"
                if message.level == messages.ERROR
                else "warning" if message.level == messages.WARNING else "success"
            ),
            "html": conditional_escape(message.message),
        }
        for message in messages.get_messages(request)
    ]


class BaseResponse(JsonResponse):
    """
    Base class for all Django Render responses.
    """

    status = None

    def __init__(self, *args, http_status=None, **kwargs):
        js_context = JSContext()
        data = {
            "status": self.status,
        }
        data.update(js_context.pack(self.get_data(*args, **kwargs)))
        super().__init__(data, status=http_status)
        self["X-DjangoRender-Status"] = self.status

        # Make sure that djrender responses are never cached by browsers
        # We need to do this because Django Render responses are given on the same URLs that
        # users would otherwise get HTML responses on if they visited those URLs
        # directly.
        # If djrender response is cached, there's a chance that a user could see the
        # JSON document in their browser rather than a HTML page.
        # This behaviour only seems to occur (intermittently) on Firefox.
        patch_cache_control(self, no_store=True)

    def get_data(self):
        return {}


class Response(BaseResponse):
    """
    Instructs djrender to render a view (React component) with the given context.
    """

    status = "render"

    def __init__(self, request, *args, overlay=False, title="", **kwargs):
        self.request = request
        self.overlay = overlay
        self.title = title
        super().__init__(*args, **kwargs)

    def get_data(self, view, props):
        return {
            "view": view,
            "overlay": self.overlay,
            "title": self.title,
            "props": props,
            "context": {
                name: import_string(provider)(self.request)
                for name, provider in settings.DJREAM_CONTEXT_PROVIDERS.items()
            },
            "messages": get_messages(self.request),
        }


class ReloadResponse(BaseResponse):
    """
    Instructs the djrender to load the view the old-fashioned way.
    """

    status = "reload"


class RedirectResponse(BaseResponse):
    status = "redirect"

    def get_data(self, path):
        return {
            "path": path,
        }


class CloseOverlayResponse(BaseResponse):
    status = "close-overlay"

    def __init__(self, request, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def get_data(self):
        return {
            "messages": get_messages(self.request),
        }


class NotFoundResponse(Response):
    status_code = 404
