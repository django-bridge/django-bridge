import functools

from django.shortcuts import render

from .response import ShellResponse, ShellResponseLoadIt, convert_to_shell_response


def shell_enable(fn):
    """
    Enables Wagtail shell on the given view.
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.wagtailshell_enabled = True
        response = fn(request, *args, **kwargs)

        # Attempt to convert non-shell response into a shell response
        if response.status_code == 200 and not isinstance(response, ShellResponse) and request.wagtailshell_enabled and not request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
            response = convert_to_shell_response(request, response)

        # If the request was made by the shell (using `fetch()`, rather than a regular browser request)
        if request.META.get('HTTP_X_REQUESTED_WITH') == 'WagtailShell':
            if isinstance(response, ShellResponse):
                return response
            else:
                # Response couldn't be converted into a shell response. Reload the page
                return ShellResponseLoadIt()

        # Regular browser request
        if isinstance(response, ShellResponse):
            # Wrap the response with our shell bootstrap template
            return render(request, 'wagtailshell/bootstrap.html', {
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
        request.wagtailshell_enabled = False
        return fn(request, *args, **kwargs)

    return wrapper
