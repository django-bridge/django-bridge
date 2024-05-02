# Responses

In a Django render application, Django views return JSON that is rendered in the browser using React. This allows a neat split between business logic implemented in Django and presentational logic written in React:

All business logic is implemented in the Django backend, so there's no need to bloat the frontend with complex state management and API libraries. Also, the response from the Django view provides the complete data that is required to render the view in a single request.

All presentational logic is implemented in the React frontend, enhancing page rendering speeds once the initial JavaScript bundle is loaded. Though the first request may take slightly longer due to this loading process, subsequent interactions become nearly instantaneous. React is also a significant improvement over traditional Django templates, which often require extensive custom template tags to achieve comparable functionality.

## Anatomy of a Response

Here's an example response from [demo.django-render.org/posts/](https://demo.django-render.org/posts/)

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

The most important keys are the ``status``, ``view`` and ``props``. These instruct the frontend to render the "PostIndex" view with the list of posts provided.

The ``overlay`` key is a boolean that will only be ``true`` if the request was from an overlay and the view supports this mode of rendering, it's used to exit the overlay for views that don't support overlays.

The ``title`` key contains the title to put in the title bar on the browser.

The ``context`` key contains global variables that are always provided and can be accessed using [``React.useContext``](https://react.dev/reference/react/useContext). These are used in a similar way to Django's [template context processsors](https://docs.djangoproject.com/en/5.0/ref/templates/api/#built-in-template-context-processors).

The ``messages`` key contains a list of messages emitted by [Django's messages framework](https://docs.djangoproject.com/en/5.0/ref/contrib/messages/) to be displayed when this response is rendered.

## The initial response

The first request that a user makes to a Django Render app will be converted to HTML by the ``DjangoRenderMiddleware``. This HTML loads the JavaScript bundle and nests the initial JSON response, so it can be immediately rendered once the bundle loads.

All links within the app are fetched with AJAX allowing the response to be rendered without reloading the whole page.s
These AJAX requests have a ``X-Requested-With: DjangoRender`` header which instructs the server to send the raw HTML without converting it to HTML.
