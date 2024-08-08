import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Ready for action",
    description: (
      <>
        Ship your next product fast with the most productive backend framework,
        access to the React ecosystem, and iterate quickly with Vite hot-reloading.
      </>
    ),
  },
  {
    title: "Batteries included",
    description: (
      <>
        Render Django forms with React. Build modals with Django Views. Authenticate users with <a href="https://docs.allauth.org/en/latest/" rel="nofollow">allauth</a>.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        Django Bridge adds only ~11KB to your bundle size and encourages as few server round-trips as possible, it also works great with plain React.
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
