# How it works

This document gives an overview of how Django Render works.

## Django views return JSON

Django Render applications use Django views that return JSON instead of HTML. The JSON that's returned describes what to render to the React Frontend.

For example, here's a response from [demo.django-render.org/posts/](https://demo.django-render.org/posts/)

```json
{
    "status": "render",
    "view": "PostIndex",
    "overlay": false,
    "title": "Posts | Djangopress",
    "props": {
        "posts": [
            {"title": "Post 1", "edit_url": "/posts/1/edit/"},
            {"title": "Post 2", "edit_url": "/posts/2/edit/"}
        ]
    },
    "context": {
        "csrf_token": "..."
    },
    "messages": []
}
```

The most important keys are the ``status``, ``view` and ``props``. These instruct the frontend to render the "PostIndex" view with the list of posts provided.

The ``context`` key contains global variables that are always provided and can be accessed using [``React.useContext``](https://react.dev/reference/react/useContext). These are used in a similar way to Django's [template context processsors](https://docs.djangoproject.com/en/5.0/ref/templates/api/#built-in-template-context-processors).

The ``title`` key contains the title to put in the title bar on the browser.

The ``overlay`` key is a boolean that will only be ``true`` if the request was from an overlay and the view supports this mode of rendering, it's used to exit the overlay for views that don't support overlays.

The ``messages`` key contains a list of messages emitted by [Django's messages framework](https://docs.djangoproject.com/en/5.0/ref/contrib/messages/) to be displayed when this response is rendered.

## The initial response

If Django Render applications only return JSON, how would a browser render it?

The first request that a user makes to a Django Render app will be converted to HTML by the ``DjangoRenderMiddleware``. This HTML loads the JavaScript bundle and nests the initial JSON response, so it can be immediately rendered once the bundle loads.

All links within the app are fetched with AJAX allowing the response to be rendered without reloading the whole page.
These AJAX requests have a ``X-Requested-With: DjangoRender`` header which instructs the server to send the raw HTML without converting it to HTML.

## Linking to and from template-rendered views

Because Django Render uses Django's URL routing, its possible to link to/from template-rendered views. React views can be linked to from Django templates using the ``{% url %}`` tag or from Python using the ``reverse()`` function.

You can use this to incrementally convert a template rendered application to React, or use third-party packages that use Django templates for rendering alongside your React app.

You only need to make sure you use the correct component for the link type in the React app. Links to other views in the React app should use the ``<Link>`` component to prevent the page reloading, all other links should use the ``<a>`` tag.

## Serialising Python objects to JSON

Django Render embeds the [Telepath](https://wagtail.github.io/telepath/) library, which serializes Python objects to JSON and deserializes that JSON into JavaScript objects.

For example, Django Render bundles support for serializing Django forms so they can be rendered with React:

```python
def form_view(request):
    form = Form(request.POST or None)
    if form.is_valid():
        # Do form save here
    return Response(request, "FormView", {
        # You can put any serializable object here and it will be automatically serialized for you
        "form": form
    })
```

Then on the frontend, use ``FormDef.render()``:

```tsx
import { useContext } from "react":


export function FormView({ form }) {
  const csrfToken = useContext(CSRFTokenContext);

  return (
    <Form action="/form/" method="post">
      <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />

      {form.render()}

      <button type="submit">Submit</button>
    </Form>
  );
}
```

Django forms are automatically converted to instances of the ``FormDef`` class that is bundled with Django Render. This class has a ``render()`` method that renders the form using React Components.

Django Render comes with a ``<Form>`` component which submits the form data with an AJAX request and renders the response without reloading the page.
