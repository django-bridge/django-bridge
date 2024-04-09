import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Overview" description={siteConfig.tagline}>
      <header className={clsx("hero hero--primary", styles.header)}>
        <h1>Overview</h1>
        <p>
          This doc gives a quick overview of how a Django Render app is
          constructed.
        </p>
      </header>
      <main className={styles.main}>
        <h2>1. Create a view</h2>
        <p>
          Django Render-enabled views return a Response containing the component
          name and dictionary of props. Props can contain any JSON serializable
          value or object that has a JavaScript equivalent class.
        </p>
        <CodeBlock title="views.py" language="python">
          {`from django_render import django_render_view, Response

@django_render_view
def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    form = PostForm(request.POST or None, instance=post)

    if form.is_valid():
        form.save()
        return redirect("post_detail", post_id=post.id)

    return Response(request, "PostForm", {
        "title": post.title,
        # Python objects, like forms, can be converted into JavaScript objects
        "form": form,
        "form_action": reverse("post_edit", args=[post.id]),
    })
`}
        </CodeBlock>

        <CodeBlock title="urls.py" language="python">
          {`urlpatterns = [
    ...

    path(
        "posts/<int:post_id>/edit/",
        views.post_edit, name="post_edit"
    ),
]`}
        </CodeBlock>

        <h2>2. Create a React component to render the view</h2>
        <p>
          The component will receive the props from the Response. Global props
          can defined which are passed to all components. For example the
          `csrf_token` is passed to all components by default.
        </p>

        <CodeBlock title="views/PostForm.jsx" language="jsx">
          {`import { Button, Form } from "@django_render/ui";

export default function PostFormView({
  title,
  form,
  form_action,
  csrf_token
}) {
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
}`}
        </CodeBlock>

        <h2>3. Create a Django Render app</h2>
        <p>
          Pass a map of view components to the Django RenderApp component and it
          will render the initial response. As the user navigates through the
          app, subsequent views are loaded via AJAX and rendered in the same
          way.
        </p>
        <CodeBlock title="app.jsx" language="jsx">
          {`import * as DjangoRender from "@django_render/core";
import PostFormView from "./views/PostForm";

// List of views that can be rendered by Django Render
const config = new DjangoRender.Config();
config.addView("PostForm", PostFormView);

function App(): ReactElement {
  // Get the initial response from the server
  // This is used to render the first view,
  // subsequent views are loaded via AJAX
  const rootElement = document.getElementById("root");
  const initialResponse = rootElement.dataset.initialResponse;

  return (
    <DjangoRender.App
      config={config}
      initialResponse={JSON.parse(initialResponse)}
    />
  );
}

export default App;`}
        </CodeBlock>
      </main>
    </Layout>
  );
}
