from meze.decorators import meze_view
from meze.response import MezeResponse


@meze_view
def home(request):
    return MezeResponse(request, "Home", {})
