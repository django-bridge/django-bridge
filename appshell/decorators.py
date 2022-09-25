import hashlib
import json
from functools import update_wrapper, wraps
from pathlib import Path

from django.conf import settings
from django.shortcuts import render
from django.urls import reverse

from .response import (
    AppShellLoadItResponse,
    AppShellRedirectResponse,
    BaseAppShellResponse,
)


def _decorate_urlpatterns(urlpatterns, decorator):
    """Decorate all the views in the passed urlpatterns list with the given decorator"""
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


def appshell_enable(fn):
    """
    Wraps a view to make it load with the shell.
    """

    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.shell_enabled = True
        response = fn(request, *args, **kwargs)

        if response.status_code == 301:
            return response

        # If the request was made by the shell (using `fetch()`, rather than a regular browser request)
        if request.META.get("HTTP_X_REQUESTED_WITH") == "Shell":
            if isinstance(response, BaseAppShellResponse):
                return response

            elif response.status_code == 302:
                return AppShellRedirectResponse(response["Location"])

            else:
                # Response couldn't be converted into a shell response. Reload the page
                return AppShellLoadItResponse()

        # Regular browser request
        if isinstance(response, BaseAppShellResponse):
            if settings.APPSHELL_VITE_SERVER_ORIGIN:
                # Development - Fetch JS/CSS from Vite server
                js = [
                    settings.APPSHELL_VITE_SERVER_ORIGIN + "/@vite/client",
                    settings.APPSHELL_VITE_SERVER_ORIGIN
                    + "/static/src/main.tsx",
                ]
                css = []
                vite_react_refresh_runtime = (
                    settings.APPSHELL_VITE_SERVER_ORIGIN + "/@react-refresh"
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

            # Wrap the response with our shell bootstrap template
            return render(
                request,
                "appshell/bootstrap.html",
                {
                    "data": response.content.decode("utf-8"),
                    "globals_data": json.dumps(
                        {
                            "user": {
                                "displayName": request.user.get_full_name(),
                                "avatarUrl": "https://www.gravatar.com/avatar/{}?s=128&d=identicon".format(
                                    hashlib.md5(
                                        request.user.email.lower()
                                        .strip()
                                        .encode("utf-8")
                                    ).hexdigest()
                                ),
                            }
                            if request.user.is_authenticated
                            else None,
                            "urls": {
                                "userProfile": reverse("user_profile"),
                            },
                        }
                    ),
                    "js": js,
                    "css": css,
                    "vite_react_refresh_runtime": vite_react_refresh_runtime,
                },
            )
        else:
            return response

    return wrapper


def appshell_exempt(fn):
    """
    Excludes a view from the app shell to override appshell_enable_urlpatterns.
    """

    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.shell_enabled = False
        return fn(request, *args, **kwargs)

    return wrapper


def appshell_enable_urlpatterns(urlpatterns):
    return _decorate_urlpatterns(urlpatterns, appshell_enable)
