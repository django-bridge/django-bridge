import styles from "./styles.module.css";
import CodeBlock from "@theme/CodeBlock";

const steps = [
  {
    title: "Create a Djream-enabled view",
    description:
      "Djream-enabled views return a DjreamResponse containing the component name and dictionary of props. Props can contain any JSON serializable value or object that has a JavaScript equivalent class.",
    code: (
      <>
        <CodeBlock language="python" title="views.py">
          {`from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from djream import djream_view, DjreamResponse

from .forms import PostForm


@djream_view
def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = PostForm(request.POST or None, instance=post)

    if form.is_valid():
        form.save()
        return redirect("post_detail", post_id=post.id)

    return DjreamResponse(request, "PostForm", {
        "title": post.title,
        "form": form,
        "form_action": reverse("post_edit", args=[post.id]),
    })`}
        </CodeBlock>
        <CodeBlock language="python" title="urls.py">
          {`urlpatterns = [
    ...

    path(
        "posts/<int:post_id>/edit/",
        views.post_edit, name="post_edit"
    ),
]`}
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Create a React component to render the view",
    description:
      "The component will receive the props from the DjreamResponse. Global props can defined which are passed to all components. For example the csrf_token is passed to all components by default.",
    code: (
      <CodeBlock
        language="tsx"
        title="views/PostForm.tsx"
      >{`import { Button, Form, FormDef } from "@djream/ui";

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
}`}</CodeBlock>
    ),
  },
  {
    title: "Create a Djream app",
    description:
      "Pass a map of view components to the DjreamApp component and it will render the initial response. As the user navigates through the app, subsequent views are loaded via AJAX and rendered in the same way.",
    code: (
      <CodeBlock
        language="tsx"
        title="App.tsx"
      >{`import * as Djream from "@djream/core";
import PostFormView from "./views/PostForm";

// List of views that can be rendered by Djream
const config = new Djream.Config();
config.addView("PostForm", PostFormView);

function App(): ReactElement {
  // Get the initial response from the server
  // This is used to render the first view,
  // subsequent views are loaded via AJAX
  const rootElement = document.getElementById("root");
  const initialResponse = rootElement.dataset.initialResponse;

  return (
    <Djream.App
      config={config}
      initialResponse={JSON.parse(initialResponse)}
    />
  );
}

export default App;`}</CodeBlock>
    ),
  },
];

export default function HomepageCodeExample(): JSX.Element {
  return (
    <section className={styles.codeexample}>
      <ol className={styles.steps}>
        {steps.map((step, idx) => (
          <li key={idx}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {step.code}
          </li>
        ))}
      </ol>
    </section>
  );
}
