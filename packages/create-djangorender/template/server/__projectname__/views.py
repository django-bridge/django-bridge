from djangorender.decorators import djangorender_view
from djangorender.response import Response


@djangorender_view
def home(request):
    return Response(request, "Home", {})
