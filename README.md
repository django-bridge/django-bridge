# Wagtail Shell

Wagtail Shell is an experimental single-page-application for Wagtail admin which provides global user interfaces (such as the menu and modal workflow) and fetches all view content over an API.

## Why?

 - It removes page reloads for almost all navigation for a more fluid user experience
 - This reduces the complexity of Wagtail admin by separating the menu/modal code from the view code
 - It allows us to use different frontend frameworks for views in Wagtail admin without breaking the menu or modals
 - All content is fetched over an API. Legacy views are rendered in an iframe but views can also return context for a JS component to render as well
 
## Why the name?

Wagtail Shell fulfills a similar role for Wagtail that an OS shell would fulfill for an OS.
For example, Windows shell provides the task bar, start menu, and windowing for Windows users.
Wagtail shell procides the left hand menu and modal workflow UI for Wagtail users.

## What does it look like?

![Wagtail Shell Expanded](/screenshots/expanded.png)

# Installation

**Please note that this project is still very much experimental, is not very well tested, and is likely to change in backwards-incompatible ways without notice**

But if you'd like help this project by being an early tester, here's how to install!

Install ``wagtail-shell`` with pip:

    pip install wagtail-shell


Add it to ``INSTALLED_APPS``:

```python
# settings.py

INSTALLED_APPS = [
    # ...

    # Must be above wagtail.admin
    'wagtail_shell',

    # ...
]

```

Decorate all Wagtail admin URLs with ``shell_enable`` using Wagtail's ``decorate_urlpatterns`` helper:

```python
# urls.py

from django.conf.urls import include, url
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.utils.urlpatterns import decorate_urlpatterns
from wagtail_shell.decorators import shell_enable


urlpatterns = decorate_urlpatterns([
    # All URLs that you want to use the Wagtail menu on go here
    # You can also add Django admin or custom views here if you want to!
    url(r'^admin/', include(wagtailadmin_urls)),
], shell_enable) + [
    # All other URLs here
]
```
