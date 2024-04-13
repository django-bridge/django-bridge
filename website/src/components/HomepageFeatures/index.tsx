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
        A ready-to-use library and project template for Django/React applications that works.
        Supports Storybook and Vite hot-reloading for fast frontend development.
      </>
    ),
  },
  {
    title: "Seamless Django integration",
    description: (
      <>
        Works with Django's forms, messages, session authentication, and more.
        Also supports mixing-and-matching with template-rendered views.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        All context is sent in the initial request, so apps render instantly.
        Django Render and React add ~45KB (gzipped) to your bundle size.
      </>
    ),
  },
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
