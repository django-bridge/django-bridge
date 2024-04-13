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
        Build applications fast combining Django's productivity with React's interactivity.
        Supports Storybook and Vite hot reloading for fast frontend development.
      </>
    ),
  },
  {
    title: "Seamless Django integration",
    description: (
      <>
        Use Django's forms, messages, session authentication, and more.
        You can even mix-and-match React and template-rendered views!
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        All context is sent in the initial request, so your app can render instantly.
        Django Render and React add 5KB and 40KB (gzipped) to your bundle size.
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
