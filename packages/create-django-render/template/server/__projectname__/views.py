from django_render.decorators import django_render_view
from django_render.response import Response


@django_render_view
def home(request):
    return Response(request, "Home", {})
