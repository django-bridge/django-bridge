# Overview

This doc gives a quick overview of how a Meze app is constructed.

## 1. Create a view

Meze-enabled views return a MezeResponse containing the component name and dictionary of props. Props can contain any JSON serializable value or object that has a JavaScript equivalent class.

```python title="views.py
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from meze import meze_view, MezeResponse

from .forms import PostForm


@meze_view
def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = PostForm(request.POST or None, instance=post)

    if form.is_valid():
        form.save()
        return redirect("post_detail", post_id=post.id)

    return MezeResponse(request, "PostForm", {
        "title": post.title,
        "form": form,
        "form_action": reverse("post_edit", args=[post.id]),
    })
```

```python title="urls.py
urlpatterns = [
    ...

    path(
        "posts/<int:post_id>/edit/",
        views.post_edit, name="post_edit"
    ),
]
```


## 2. Create a React component to render the view

The component will receive the props from the MezeResponse. Global props can defined which are passed to all components. For example the csrf_token is passed to all components by default.

```tsx title="views/PostForm.tsx"
import { Button, Form, FormDef } from "@meze/ui";

interface PostFormViewProps {
  title: string;
  form: FormDef;
  form_action: string;
  csrf_token: string;
}

export default function PostFormView({
  title,
  form,
  form_action,
  csrf_token
}: PostFormViewProps) {
  return (
    <>
      <h1>{title}</h1>

      <Form action={form_action} method="post">
        <input
          type="hidden"
          name="csrfmiddlewaretoken"
          value={csrf_token}
        />
        {form.render()}
        <Button type="submit">Save</Button>
      </Form>
    </>
  );
}
```

## 3. Create a Meze app

Pass a map of view components to the MezeApp component and it will render the initial response. As the user navigates through the app, subsequent views are loaded via AJAX and rendered in the same way.

```tsx title="app.tsx"
import * as Meze from "@meze/core";
import PostFormView from "./views/PostForm";

// List of views that can be rendered by Meze
const config = new Meze.Config();
config.addView("PostForm", PostFormView);

function App(): ReactElement {
  // Get the initial response from the server
  // This is used to render the first view,
  // subsequent views are loaded via AJAX
  const rootElement = document.getElementById("root");
  const initialResponse = rootElement.dataset.initialResponse;

  return (
    <Meze.App
      config={config}
      initialResponse={JSON.parse(initialResponse)}
    />
  );
}

export default App;
```
