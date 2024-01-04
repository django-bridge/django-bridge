import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "No API required",
    description: (
      <>
        Use Django views and URL routing to create a backend for your React SPA,
        so you can focus on building features, not glue code.
      </>
    ),
  },
  {
    title: "Seamless Django integration",
    description: (
      <>
        Djream works with Django's built-in features, like forms, and can render
        Django views in modals. It can also be used alongside traditional
        template-rendered views.
      </>
    ),
  },
  {
    title: "Lightweight",
    description: (
      <>
        Djream is 3.6KB (minified, gzipped). All data necessary to render a view
        is included in the initial page load, so it loads instantly. It doesn't require
        any extra frontend dependencies apart from React.
      </>
    ),
  },
  // {
  //   title: 'Create modal workflows with Django views',
  //   description: (
  //     <>
  //       Djream-rendered views can be opened in a modal instead of a new page.
  //       This makes it easy to create a modal workflows using Django views.
  //     </>
  //   ),
  // },
  // // {
  // //   title: 'Intelligent dirty-form checking',
  // //   description: (
  // //     <>
  // //       When users navigate away with unsaved changes, Djream will prompt them to
  // //       confirm before leaving. This works for closing modals too.
  // //     </>
  // //   ),
  // // },
  // {
  //   title: 'Mix with template-rendered views',
  //   description: (
  //     <>
  //       Djream-rendered views can be created alongside traditional views rendered with templates
  //       allowing you to incrementally migrate your app to a React SPA or use third-party apps
  //       that don't have a React frontend.
  //     </>
  //   ),
  // },
  // {
  //   title: 'Iterate fast with Vite hot reloading',
  //   description: (
  //     <>
  //       If you use Vite to build your React app, Djream will enable hot reloading in development.
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
