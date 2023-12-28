import json
from functools import update_wrapper, wraps
from pathlib import Path

from django.conf import settings
from django.shortcuts import render

from .response import (
    BaseDjreamResponse,
    DjreamLoadItResponse,
    DjreamRedirectResponse,
)


def _decorate_urlpatterns(urlpatterns, decorator):
    """
    Decorate all the views in the passed urlpatterns list with the given decorator
    """
    for pattern in urlpatterns:
        if hasattr(pattern, "url_patterns"):
            # this is an included RegexURLResolver; recursively decorate the views
            # contained in it
            _decorate_urlpatterns(pattern.url_patterns, decorator)

        if getattr(pattern, "callback", None):
            pattern.callback = update_wrapper(
                decorator(pattern.callback), pattern.callback
            )

    return urlpatterns


def djream_enable(fn):
    """
    Wraps a view to make it load with djream
    """

    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.djream_enabled = True
        response = fn(request, *args, **kwargs)

        if response.status_code == 301:
            return response

        # If the request was made by djream
        # (using `fetch()`, rather than a regular browser request)
        if request.META.get("HTTP_X_REQUESTED_WITH") == "Shell":
            if isinstance(response, BaseDjreamResponse):
                return response

            elif response.status_code == 302:
                return DjreamRedirectResponse(response["Location"])

            else:
                # Response couldn't be converted into a djream response. Reload the page
                return DjreamLoadItResponse()

        # Regular browser request
        if isinstance(response, BaseDjreamResponse):
            if settings.DJREAM_VITE_SERVER_ORIGIN:
                # Development - Fetch JS/CSS from Vite server
                js = [
                    settings.DJREAM_VITE_SERVER_ORIGIN + "/@vite/client",
                    settings.DJREAM_VITE_SERVER_ORIGIN + "/static/src/main.tsx",
                ]
                css = []
                vite_react_refresh_runtime = (
                    settings.DJREAM_VITE_SERVER_ORIGIN + "/@react-refresh"
                )
            else:
                # Production - Use asset manifest to find URLs to bundled JS/CSS
                asset_manifest = json.loads(
                    Path("/client/manifest.json").read_text()
                )

                js = [
                    "/static/" + asset_manifest["src/main.tsx"]["file"],
                ]
                css = asset_manifest["src/main.tsx"]["css"]
                vite_react_refresh_runtime = None

            # Wrap the response with our bootstrap template
            new_response = render(
                request,
                "djream/bootstrap.html",
                {
                    "data": response.content.decode("utf-8"),
                    "js": js,
                    "css": css,
                    "vite_react_refresh_runtime": vite_react_refresh_runtime,
                },
            )

            # Copy status_code and cookies from the original response
            new_response.status_code = response.status_code
            new_response.cookies = response.cookies

            return new_response
        else:
            return response

    return wrapper


def djream_exempt(fn):
    """
    Excludes a view from djream to override djream_enable_urlpatterns.
    """

    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.djream_enabled = False
        return fn(request, *args, **kwargs)

    return wrapper


def djream_enable_urlpatterns(urlpatterns):
    return _decorate_urlpatterns(urlpatterns, djream_enable)
