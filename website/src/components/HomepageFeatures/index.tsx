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
        Ship your next product fast with the most productive backend framework
        and access to the React ecosystem of frontend components. Iterate
        quickly with Vite hot-reloading and Storybook.
      </>
    ),
  },
  {
    title: "Simple, familiar, compatible",
    description: (
      <>
        Build single-page-applications that are powered by standard Django views
        and forms. Provides minimal frontend tooling that works with all React
        component and styling libraries.
      </>
    ),
  },
  {
    title: "Lightweight and fast",
    description: (
      <>
        Specialised backend views are easier to optimise than generic
        APIs/GraphQL and provide all the data a page needs in a single
        round-trip. Keep your frontend small and light by keeping routing,
        business logic, and state management on the server.
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
