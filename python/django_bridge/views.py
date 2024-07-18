from django.views.generic.base import ContextMixin, View

from .response import Response


class DjangoBridgeMixin:
    """A mixin that can be used to render a view with a React component."""

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


class DjangoBridgeView(DjangoBridgeMixin, ContextMixin, View):
    """
    A class-based view that can be used to render views with React.
    """

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)
