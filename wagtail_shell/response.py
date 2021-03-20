from django.http import JsonResponse
from django.shortcuts import render


class ShellResponse(JsonResponse):
    status = None

    def __init__(self, *args, mode='browser', **kwargs):
        data = {
            'status': self.status,
            'mode': mode,
        }
        data.update(self.get_data(*args, **kwargs))
        super().__init__(data)
        self['X-WagtailShell-Status'] = self.status
        self['X-WagtailShell-Mode'] = mode

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


def convert_to_shell_response(request, response):
    """
    Converts a non-shell response into a shell one.
    """
    # If the response is HTML and isn't the login view then return a "render HTML
    # response that wraps the response in an iframe on the frontend

    # FIXME: Find a proper mime type parser
    is_html = response.get('Content-Type').startswith('text/html')
    if is_html:
        if hasattr(response, 'render'):
            response.render()

        render_in_modal = request.META.get('HTTP_X_WAGTAILSHELL_MODE') == 'modal' and getattr(request, 'wagtailshell_modal_safe', False)

        if getattr(request, 'wagtailshell_template_enabled', False):
            return ShellResponseRenderHtml(response.content.decode('utf-8'), mode='modal' if render_in_modal else 'browser')

    # Can't convert the response
    return response
