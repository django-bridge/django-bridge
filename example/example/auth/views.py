from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.middleware.csrf import get_token
from django.shortcuts import resolve_url
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters

from djream.decorators import djream_view
from djream.response import DjreamResponse


@djream_view
@sensitive_post_parameters()
@csrf_protect
@never_cache
def login(
    request,
    redirect_field_name=REDIRECT_FIELD_NAME,
    authentication_form=AuthenticationForm,
    extra_context=None,
):
    """
    Displays the login form and handles the login action.
    """
    redirect_to = request.POST.get(
        redirect_field_name, request.GET.get(redirect_field_name, "")
    )

    if request.method == "POST":
        form = authentication_form(request, data=request.POST)
        if form.is_valid():
            # Ensure the user-originating redirection url is safe.
            if not url_has_allowed_host_and_scheme(
                url=redirect_to, allowed_hosts=[request.get_host()]
            ):
                redirect_to = resolve_url(settings.LOGIN_REDIRECT_URL)

            # Okay, security check complete. Log the user in.
            auth_login(request, form.get_user())

            return HttpResponseRedirect(redirect_to)
    else:
        form = authentication_form(request)

    context = {
        "csrfToken": get_token(request),
        "form": form,
        redirect_field_name: redirect_to,
        "actionUrl": reverse("auth_login"),
    }
    if extra_context is not None:
        context.update(extra_context)

    return DjreamResponse(request, "auth-login", context)
