import json
from pathlib import Path

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import StreamingHttpResponse
from django.shortcuts import render
from django.templatetags.static import static

from .response import BaseResponse, RedirectResponse, ReloadResponse


class DjangoBridgeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if isinstance(response, StreamingHttpResponse):
            return response

        if response.status_code == 301:
            return response

        # If the request was made by Django Bridge
        # (using `fetch()`, rather than a regular browser request)
        if request.META.get("HTTP_X_REQUESTED_WITH") == "DjangoBridge":
            if isinstance(response, BaseResponse):
                return response

            elif response.status_code == 302:
                return RedirectResponse(response["Location"])

            else:
                # Response couldn't be converted into a Django Bridge response. Reload the page
                return ReloadResponse()

        # Regular browser request
        # If the response is a Django Bridge response, wrap it in our bootstrap template
        # to load the React SPA and render the response data.
        if isinstance(response, BaseResponse):
            VITE_BUNDLE_DIR = settings.DJANGO_BRIDGE.get("VITE_BUNDLE_DIR")
            VITE_DEVSERVER_URL = settings.DJANGO_BRIDGE.get("VITE_DEVSERVER_URL")
            if VITE_BUNDLE_DIR:
                # Production - Use asset manifest to find URLs to bundled JS/CSS
                asset_manifest = json.loads(
                    (Path(VITE_BUNDLE_DIR) / ".vite/manifest.json").read_text()
                )

                js = [
                    static(asset_manifest["src/main.tsx"]["file"]),
                ]
                css = asset_manifest["src/main.tsx"].get("css", [])
                vite_react_refresh_runtime = None

            elif VITE_DEVSERVER_URL:
                # Development - Fetch JS/CSS from Vite server
                js = [
                    VITE_DEVSERVER_URL + "/@vite/client",
                    VITE_DEVSERVER_URL + "/src/main.tsx",
                ]
                css = []
                vite_react_refresh_runtime = VITE_DEVSERVER_URL + "/@react-refresh"

            else:
                raise ImproperlyConfigured(
                    "DJANGO_BRIDGE['VITE_BUNDLE_DIR'] (production) or DJANGO_BRIDGE['VITE_DEVSERVER_URL'] (development) must be set"
                )

            # Wrap the response with our bootstrap template
            new_response = render(
                request,
                "django_bridge/bootstrap.html",
                {
                    "initial_response": json.loads(response.content.decode("utf-8")),
                    "js": js,
                    "css": css,
                    "vite_react_refresh_runtime": vite_react_refresh_runtime,
                },
            )

            # Copy status_code and cookies from the original response
            new_response.status_code = response.status_code
            new_response.cookies = response.cookies

            return new_response

        return response
