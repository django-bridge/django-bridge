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
        A simple and ready-to-use framework for building SaaS and internal
        applications with Django and React. Supports Storybook and Vite
        hot-reloading for productive frontend development.
      </>
    ),
  },
  {
    title: "Seamless Django integration",
    description: (
      <>
        Use Django's forms, messages, session authentication, and more within
        React. Also supports mixing-and-matching with template-rendered views.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        Eliminate unnecessary round-trips to the server by using Django views
        instead of generic APIs. Django Render adds only ~11KB to your bundle
        size.
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
