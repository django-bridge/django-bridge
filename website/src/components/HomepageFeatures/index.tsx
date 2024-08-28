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
        Ship your next product fast with the most productive backend framework.
        Iterate your frontend quickly with hot-reloading.
      </>
    ),
  },
  {
    title: "Familiar and compatible",
    description: (
      <>
        Build modern SPAs that are powered by standard Django views and forms.
        Compatible with common React development practises, component libraries
        and styling frameworks.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        Keep your frontend lean by putting all app logic in Django views. Django
        views are easier to optimise than generic APIs/GraphQL and provide all
        the data a page needs in a single round-trip.
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
