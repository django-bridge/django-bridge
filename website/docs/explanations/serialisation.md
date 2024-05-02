# Using Python objects in React

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
