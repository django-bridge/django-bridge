import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Rapid development",
    description: (
      <>
        Django Render provides a standard way to build React SPAs with Django
        backends. It handles routing, data fetching, and state management so you
        can focus on building features.
      </>
    ),
  },
  {
    title: "Seamless Django integration",
    description: (
      <>
        Render your Django forms with React so you can use Django's form
        validation and error handling. Django Render also allows mixing
        template-rendered views with React-rendered views.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        Pages load instantly as all necessary data is sent in the initial
        response. Django Render itself is 5.5KB gzipped and only depends on React. No
        need to install a separate router or state management library.
      </>
    ),
  },
  // {
  //   title: 'Create modal workflows with Django views',
  //   description: (
  //     <>
  //       Django Render-rendered views can be opened in a modal instead of a new page.
  //       This makes it easy to create a modal workflows using Django views.
  //     </>
  //   ),
  // },
  // // {
  // //   title: 'Intelligent dirty-form checking',
  // //   description: (
  // //     <>
  // //       When users navigate away with unsaved changes, Django Render will prompt them to
  // //       confirm before leaving. This works for closing modals too.
  // //     </>
  // //   ),
  // // },
  // {
  //   title: 'Mix with template-rendered views',
  //   description: (
  //     <>
  //       Django Render-rendered views can be created alongside traditional views rendered with templates
  //       allowing you to incrementally migrate your app to a React SPA or use third-party apps
  //       that don't have a React frontend.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Iterate fast with Vite hot reloading',
  //   description: (
  //     <>
  //       If you use Vite to build your React app, Django Render will enable hot reloading in development.
  //     </>
  //   ),
  // },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
