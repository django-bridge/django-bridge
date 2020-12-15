from django.http import JsonResponse
from django.shortcuts import render


class ShellResponse(JsonResponse):
    status = None

    def __init__(self, *args, **kwargs):
        data = {
            'status': self.status,
        }
        data.update(self.get_data(*args, **kwargs))
        super().__init__(data)
        self['X-WagtailShellStatus'] = self.status

    def get_data(self):
        return {}


class ShellResponseLoadIt(ShellResponse):
    status = 'load-it'


class ShellResponseRender(ShellResponse):
    status = 'render'

    def get_data(self, view, context):
        return {
            'view': view,
            'context': context,
        }


class ShellResponseRenderHtml(ShellResponseRender):
    def get_data(self, html):
        return super().get_data('iframe', {'html': html})


class ShellResponseNotFound(ShellResponse):
    status = 'not-found'


class ShellResponsePermissionDenied(ShellResponse):
    status = 'permission-denied'


class WagtailShellMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def convert_to_shell_response(self, request, response):
        """
        Converts a non-shell response into a shell one.
        """
        # If the response is HTML, and our replacement admin_base.html was used,
        # return a "render HTML" response that wraps the response in an iframe on the frontend

        # FIXME: Find a proper mime type parser
        is_html = response.get('Content-Type') == 'text/html; charset=utf-8'
        if is_html and getattr(request, 'shell_template_rendered', False):
            return ShellResponseRenderHtml(response.content.decode('utf-8'))

        # Can't convert the response
        return response

    def __call__(self, request):
        response = self.get_response(request)

        # Attempt to convert non-shell response into a shell response
        if not isinstance(response, ShellResponse):
            response = self.convert_to_shell_response(request, response)

        # If the request was made by the shell (using `fetch()`, rather than a regular browser request)
        if request.META.get('HTTP_X_REQUESTED_WITH') == 'WagtailShell':
            if isinstance(response, ShellResponse):
                return response
            else:
                # Response couldn't be converted into a shell response. Reload the page
                return ShellResponseLoadIt()

        else:
            # Regular browser request
            if isinstance(response, ShellResponse):
                # Wrap the response with our shell bootstrap template
                return render(request, 'wagtailshell/bootstrap.html', {
                    'data': response.content.decode('utf-8'),
                })
            else:
                return response

        # FIXME: Find a proper mime type parser
        is_html = response.get('Content-Type') == 'text/html; charset=utf-8'

        # The request wasn't made by the shell, but it was and rendered using
        # Wagtail's base admin template, wrap the response with the shell's bootstrap template.
        if is_html and getattr(request, 'shell_template_rendered', False):
            return render(request, 'wagtailshell/bootstrap.html', {
                'content': response.content.decode('utf-8'),
            })

        return response
