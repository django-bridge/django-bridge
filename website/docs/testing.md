---
sidebar_position: 11
---

# Testing best practises

## Testing views

As your views are regular Django views, we recommend using [Django's built-in test framework](https://docs.djangoproject.com/en/5.0/topics/testing/overview/).

The main difference from a regular Django view test us you need to pass an extra header to make Django Render return JSON: ``X-Requested-With: DjangoRender``. Without this, Django Render will replace the response with a HTML bootstrap response.

Here's an example of how you can test the ``current_datetime`` view in the [Writing Views](/docs/views) document:

```python
from datetime import datetime
from django.test import TestCase
from django.urls import reverse


class CurrentDateTimeViewTestCase(TestCase):
    def setUp(self):
        pass # Set up test data here.

    def test_get(self):
        response = self.client.get(reverse("current-datetime"), HTTP_X_REQUESTED_WITH="DjangoRender")

        self.assertEqual(response.status_code, 200)
        props = response.json()
        self.assertIsInstance(props["time"], datetime)
```

### Django form submissions

Django forms submissions work exactly the same way as in a traditional Django app, so testing a POST request with a Django Form is almost exactly the same.

For example, we can write a test for the ``get_name`` view in the [Forms](/docs/forms) document:

```python
from datetime import datetime
from django.test import TestCase
from django.urls import reverse


class GetNameViewTestCase(TestCase):
    def test_post(self):
        response = self.client.post(
            reverse("get-name"),
            {"name": "Test"},
            HTTP_X_REQUESTED_WITH="DjangoRender"
        )

        self.assertRedirects(response, "/thanks/")

        # ... check name was saved correctly
```
