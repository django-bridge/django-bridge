import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Logo from "@site/static/img/django-render-text.svg";
import ReactLogo from "@site/static/img/react-logo-white.svg";
import CodeBlock from "@theme/CodeBlock";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import styles from "./index.module.css";
import Link from "@docusaurus/Link";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {<Logo width={400} />}
        </Heading>
        <p className={styles.heroSubtitle}>
          <b>Django Render</b> provides a <i>streamlined</i> approach for
          building <b>Django</b> applications with{" "}
          <b>
            <ReactLogo
              style={{
                display: "inline",
                width: "1em",
                height: "0.9em",
                paddingTop: "0.1em",
              }}
            />
            React
          </b>{" "}
          Frontends
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guide/start"
          >
            Get started
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://demo.django-render.org"
          >
            Demo
          </a>
        </div>
        <HomepageFeatures />

      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <h2>Django for logic, React for presentation</h2>

          <div className={styles.container}>
            <div className={styles.column}>
              <p>

                Keep your Django views simple and focused on the backend logic. Let
                React handle the frontend rendering.
              </p>
            </div>
            <Tabs className={styles.column}>
              <TabItem value="python" label="views.py">
                <CodeBlock language="python">{`from django_render import Response

def test(request):
    # Backend logic here

    return Response(request, "TestView", {
        "name": request.user.get_full_name(),
    })
  `}</CodeBlock>
              </TabItem>
              <TabItem value="jsx" label="TestView.jsx">
                <CodeBlock language="jsx">{`function TestView({ name }) {
    return (
      <Layout>
        <p>Hello, {name}!</p>
      </Layout>
    );
  }`}</CodeBlock>
              </TabItem>
            </Tabs>
          </div>
        </section>
        <section className={styles.section}>
         <h2>Render Django forms with React</h2>
          <div className={styles.container}>
            <div className={styles.column}>
              <p>
                Python objects, like forms and field definitions, automatically get translated into JavaScript equivalents.
              </p>
              <p>
                To render a Django form in React, pass the form object to a React component and call the render method.
              </p>

            </div>
            <Tabs className={styles.column}>
              <TabItem value="python" label="views.py">
                <CodeBlock language="python">{`from django_render import Response

def form(request):
    form = MyForm(request.POST or None)

    if form.is_valid():
        # Form submission logic here

    return Response(request, "FormView", {
        "csrf_token": get_token(request),
        "action_url": reverse("form"),
        "form": form,
    })
  `}</CodeBlock>
              </TabItem>
              <TabItem value="jsx" label="FormView.jsx">
                <CodeBlock language="jsx">{`function FormView({ csrf_token, action_url, form }) {
    return (
      <Layout>
        <Form action={action_url} method="post">
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={csrf_token} />

          {form.render()}

          <button type="submit">Submit</button>
        </Form>
      </Layout>
    );
  }`}</CodeBlock>
              </TabItem>
            </Tabs>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Create modal workflows with Django views</h2>
          <div className={styles.container}>
            <div className={styles.column}>
              <p>
                Any React-renderable view can be rendered in a modal; just pass the view's URL to the openOverlay function.
              </p>
              <p>
                Django Render will fetch the view, render it, and display it in an overlay. All links and form submissions will be rendered in the modal as well.
              </p>
              <p>
                A custom render function can be passed to the openOverlay function to customize the modal's appearance.
              </p>
            </div>
            <Tabs className={styles.column}>
              <TabItem value="jsx" label="TestView.jsx">
                <CodeBlock language="jsx">
              {`<button
  onClick={
    () => openOverlay(form_url, renderModal)
  }>
  Open Form
</button>`}
                </CodeBlock>
              </TabItem>
            </Tabs>
          </div>

        </section>
      </main>
    </Layout>
  );
}
