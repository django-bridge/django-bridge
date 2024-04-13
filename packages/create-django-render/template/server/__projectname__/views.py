from django_render.response import Response


def home(request):
    return Response(request, "Home", {})
