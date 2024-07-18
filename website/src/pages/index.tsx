import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Logo from "@site/static/img/django-render-text.svg";
import ReactLogo from "@site/static/img/react-logo-white.svg";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

import styles from "./index.module.css";
import Link from "@docusaurus/Link";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {<Logo width={400} />}
          <span className={styles.visuallyhidden}>Django Bridge</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          The simple way to build <b>Django</b> applications with modern{" "}
          <b style={{ whiteSpace: "nowrap" }}>
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
          frontends
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction"
          >
            Get started
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://demo.django-render.org"
            rel="nofollow"
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
          <h2>Build your application backend with Django</h2>
          <div className={styles.container}>
            <div className={styles.column}>
              <p>
                Use Django's URL routing and views to fetch data for your
                frontend and implement application logic.
              </p>
              <p>
                Views can return anything JSON-serializable. You can create
                [adapters](/docs/python2react) to serialize any Python object
                (like forms, for example)
              </p>
            </div>
            <div className={styles.column}>
              <Tabs>
                <TabItem value="views" label="views.py">
                  <CodeBlock language="python">{`from django_bridge import Response

def form(request):
    form = MyForm(request.POST or None)

    if form.is_valid():
        # Form submission logic here

    return Response(request, "FormView", {
        "action_url": reverse("form"),
        "form": form,
    })
  `}</CodeBlock>
                </TabItem>
                <TabItem value="urls" label="urls.py">
                  <CodeBlock language="python">{`urlpatterns = [
    path("form", views.form),
]`}</CodeBlock>
                </TabItem>
              </Tabs>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <h2>Render the frontend with React</h2>
          <div className={styles.container}>
            <div className={styles.column}>
              <p>
                Build fully client-rendered single page applications without all
                the complexity.
              </p>
              <p>
                All application logic is implemented on the server and React is
                only used for presentation, so frontends are light.
              </p>
              <p>
                You can use any styling system, or component library that you
                like.
              </p>
              <p>
                Supports Vite.js, and Storybook. Next.js support coming soon!
              </p>
            </div>
            <div className={styles.column}>
              <Tabs>
                <TabItem value="view" label="Form.jsx">
                  <CodeBlock language="jsx">{`function FormView({ action_url, form }) {
    const { csrfToken } = useContext(CSRFTokenContext);

    return (
      <Layout>
        <h1>A Django form rendered with React</h1>

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
                <TabItem value="main" label="main.jsx">
                  <CodeBlock language="jsx">{`const config = new DjangoBridge.Config();

// Add your views here
config.addView("Form", FormView);

const rootElement = document.getElementById("root");
const initialResponse = JSON.parse(
  document.getElementById("initial-response").textContent
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoBridge.App
      config={config}
      initialResponse={initialResponse}
    />
  </React.StrictMode>
);`}</CodeBlock>
                </TabItem>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
