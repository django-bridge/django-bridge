import functools

from django.shortcuts import render

from .response import ShellResponse, ShellResponseLoadIt, convert_to_shell_response


def shell_enable(fn):
    """
    Enables Wagtail shell on the given view.
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.appshell_enabled = True
        response = fn(request, *args, **kwargs)

        # Pass through redirects
        if response.status_code == 301 or response.status_code == 302:
            return response

        # Attempt to convert non-shell response into a shell response
        if response.status_code == 200 and not isinstance(response, ShellResponse) and request.appshell_enabled and not request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
            response = convert_to_shell_response(request, response)

        # If the request was made by the shell (using `fetch()`, rather than a regular browser request)
        if request.META.get('HTTP_X_REQUESTED_WITH') == 'AppShell':
            if isinstance(response, ShellResponse):
                return response
            else:
                # Response couldn't be converted into a shell response. Reload the page
                return ShellResponseLoadIt()

        # Regular browser request
        if isinstance(response, ShellResponse):
            # Wrap the response with our shell bootstrap template
            return render(request, 'appshell/bootstrap.html', {
                'data': response.content.decode('utf-8'),
            })
        else:
            return response

    return wrapper


def shell_disable(fn):
    """
    Disables Wagtail shell on the given view (overrides shell_enable).
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.appshell_enabled = False
        return fn(request, *args, **kwargs)

    return wrapper


def modal_safe(fn):
    """
    Marks it self to render this view in a modal.
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.appshell_modal_safe = True
        return fn(request, *args, **kwargs)

    return wrapper
