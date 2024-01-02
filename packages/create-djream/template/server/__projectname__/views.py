from djream.decorators import djream_view
from djream.response import DjreamResponse


@djream_view
def home(request):
    return DjreamResponse(request, "Home", {})
