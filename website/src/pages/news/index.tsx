import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="News" description={siteConfig.tagline}>
      <main className={styles.main}>
        <h1>News</h1>
        No news yet.
      </main>
    </Layout>
  );
}
