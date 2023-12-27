from django.utils.decorators import method_decorator
from django.views.generic.base import ContextMixin, View

from .decorators import djream_enable
from .response import DjreamNotFoundResponse, DjreamResponse


class DjreamResponseMixin:
    """A mixin that can be used to render djream view."""

    title = None
    view_name = None
    supported_modes = ["browser"]
    response_class = DjreamResponse

    def get_title(self):
        return self.title

    def render_to_response(self, context):
        """
        Return a response, using the `response_class` for this view, with a
        view rendered with the given context.

        Pass response_kwargs to the constructor of the response class.
        """
        return self.response_class(
            self.request,
            self.view_name,
            context,
            supported_modes=self.supported_modes,
            title=self.title,
        )


class DjreamView(DjreamResponseMixin, ContextMixin, View):
    """
    Render a djream view. Pass keyword arguments from the URLconf to the context.
    """

    @method_decorator(djream_enable)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


@djream_enable
def handler_404(request, exception=None):
    return DjreamNotFoundResponse(request)
