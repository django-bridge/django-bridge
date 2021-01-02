# Wagtail Shell

Wagtail Shell is an experimental frontend for Wagtail admin that converts it into a single-page-application and improvements to the left hand menu.

Features:
 
 - No page reloads for general navigation!
 - Left hand menu rewritten in React, with improved animations and a new collapsed mode
 - Support for views written for different frontend frameworks, such as Django admin
 - A new modal workflow UI that supports rendering any view in a modal

Coming soon:

 - Ability to write new API-driven views entirely in JavaScript (using React, Vue, or something else)

## What does it look like?

![Wagtail Shell Expanded](/screenshots/expanded.png)
![Wagtail Shell Collapsed](/screenshots/collapsed.png)

# Installation

Install ``wagtail-shell`` with pip

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
