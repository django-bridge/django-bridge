from functools import wraps

from .middleware import convert_response


def djangorender_view(fn):
    """
    Wraps a view to make it load with Django Render
    """

    @wraps(fn)
    def wrapper(request, *args, **kwargs):
        response = fn(request, *args, **kwargs)

        return convert_response(request, response)

    return wrapper
