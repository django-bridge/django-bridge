# URL Routing

Unlike other React frontend approaches, Django Render uses Django's URL routing. Each link click in the frontend will trigger a ``fetch()`` request to the Django backend to get the contents of the next page.

## Linking to and from template-rendered views

Because Django Render uses Django's URL routing, its possible to link to/from template-rendered views. React views can be linked to from Django templates using the ``{% url %}`` tag or from Python using the ``reverse()`` function.

You can use this to incrementally convert a template rendered application to React, or use third-party packages that use Django templates for rendering alongside your React app.

You only need to make sure you use the correct component for the link type in the React app. Links to other views in the React app should use the ``<Link>`` component to prevent the page reloading, all other links should use the ``<a>`` tag.
