import functools


def shell_enable(fn):
    """
    Enables Wagtail shell on the given view
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.wagtail_shell_enable = True
        return fn(request, *args, **kwargs)

    return wrapper


def shell_disable(fn):
    """
    Disables Wagtail shell on the given view (overrides shell_enable).
    """
    @functools.wraps(fn)
    def wrapper(request, *args, **kwargs):
        request.wagtail_shell_enable = False
        return fn(request, *args, **kwargs)

    return wrapper
