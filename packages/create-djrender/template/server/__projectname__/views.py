from djrender.decorators import djrender_view
from djrender.response import Response


@djrender_view
def home(request):
    return Response(request, "Home", {})
