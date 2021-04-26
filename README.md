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

In your ``urls.py``, replace the ``wagtail.admin.urls`` import with ``wagtail_shell.urls``

```python
# urls.py

from django.conf.urls import include, url
from wagtail_shell import urls as wagtailadmin_urls


urlpatterns = [
    # ...
    url(r'^admin/', include(wagtailadmin_urls)),
    # ...
]
```
