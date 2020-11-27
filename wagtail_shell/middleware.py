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


IFRAME_SAFE_VIEWS = [
    ('wagtail.admin.views.pages.listing', 'index'),
    ('wagtail.images.views.images', 'edit'),
    ('wagtail.images.views.images', 'delete'),
    ('wagtail.documents.views.documents', 'edit'),
    ('wagtail.documents.views.documents', 'delete'),
    ('wagtail.snippets.views.snippets', 'index'),
    ('wagtail.snippets.views.snippets', 'list'),
    ('wagtail.snippets.views.snippets', 'edit'),
    ('wagtail.snippets.views.snippets', 'delete'),
    ('wagtail.contrib.modeladmin.options', 'index_view'),
    ('wagtail.contrib.modeladmin.options', 'edit_view'),
    ('wagtail.contrib.modeladmin.options', 'delete_view'),
    ('wagtail.contrib.forms.views', 'FormPagesListView'),
    ('wagtail.contrib.forms.views', 'get_submissions_list_view'),
    ('wagtail.admin.views.reports', 'LockedPagesView'),
    ('wagtail.admin.views.reports', 'WorkflowView'),
    ('wagtail.admin.views.reports', 'WorkflowTasksView'),
    ('wagtail.admin.views.reports', 'LogEntriesView'),
    ('wagtail.admin.views.workflows', 'Index'),
    ('wagtail.admin.views.workflows', 'TaskIndex'),
    ('wagtail.users.views.users', 'index'),
    ('wagtail.users.views.groups', 'IndexView'),
    ('wagtail.users.views.groups', 'DeleteView'),
    ('wagtail.sites.views', 'IndexView'),
    ('wagtail.sites.views', 'EditView'),
    ('wagtail.sites.views', 'DeleteView'),
    ('wagtail.locales.views', 'IndexView'),
    ('wagtail.locales.views', 'EditView'),
    ('wagtail.locales.views', 'DeleteView'),
    ('wagtail.admin.views.collections', 'Index'),
    ('wagtail.contrib.redirects.views', 'index'),
    ('wagtail.contrib.search_promotions.views', 'index'),
    ('wagtail.contrib.styleguide.views', 'index'),
    ('wagtail.admin.views.account', 'account'),
    ('wagtail.admin.views.account', 'change_avatar'),
    ('wagtail.admin.views.account', 'change_email'),
    ('wagtail.admin.views.account', 'change_password'),
    ('wagtail.admin.views.account', 'notification_preferences'),
    ('wagtail.admin.views.account', 'language_preferences'),
    ('wagtail.admin.views.account', 'current_time_zone'),
    ('wagtail.admin.views.account', 'change_name'),
]


class WagtailShellMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def is_iframe_safe(self, request, view_func):
        """
        Returns True if the specified request/view is safe to render in
        an iframe.

        We need to know this ahead of time so that we know if we should render the
        legacy menu in "templates/wagtailadmin/base.html".
        """
        # TODO Turn this into a view decorator
        return (view_func.__module__, view_func.__name__) in IFRAME_SAFE_VIEWS

    def process_view(self, request, view_func, view_args, view_kwargs):
        request.shell_iframe_safe = self.is_iframe_safe(request, view_func)

    def convert_to_shell_response(self, request, response):
        """
        Converts a non-shell response into a shell one.
        """
        # If the response is HTML, was rendered by a view that is 'iframe safe', and used
        # our base template that excludes the menu. Return a "render HTML" response that
        # wraps the response in an iframe on the frontend

        # FIXME: Find a proper mime type parser
        is_html = response.get('Content-Type') == 'text/html; charset=utf-8'
        if is_html and request.shell_iframe_safe and getattr(request, 'shell_template_rendered', False):
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

        # The request wasn't made by the shell
        # If the response is HTML, and rendered using Wagtail's base admin template,
        # wrap the response with the shell's bootstrap template
        # so wrap the response with the shell
        # bootstrap code if
        if is_html and request.shell_iframe_safe and getattr(request, 'shell_template_rendered', False):
            return render(request, 'wagtailshell/bootstrap.html', {
                'content': response.content.decode('utf-8'),
            })

        return response
