from django.utils.decorators import method_decorator
from django.views.generic.base import ContextMixin, View

from .decorators import djangorender_view
from .response import NotFoundResponse, Response


class ResponseMixin:
    """A mixin that can be used to render djangorender view."""

    title = None
    view_name = None
    overlay = False
    response_class = Response

    def get_title(self):
        return self.title

    def render_to_response(self, props):
        """
        Return a response, using the `response_class` for this view, with a
        view rendered with the given props.

        Pass response_kwargs to the constructor of the response class.
        """
        return self.response_class(
            self.request,
            self.view_name,
            props,
            overlay=self.overlay,
            title=self.title,
        )


class DjangoRenderView(ResponseMixin, ContextMixin, View):
    """
    Render a djangorender view. Pass keyword arguments from the URLconf to the context.
    """

    @method_decorator(djangorender_view)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


@djangorender_view
def handler_404(request, exception=None):
    return NotFoundResponse(request)
