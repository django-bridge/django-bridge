import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Build React SPAs for Django apps without an API',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Build React SPAs backed by Django views and URL routing. No need to create a REST/GraphQL API.

        Return JSON from a Django view and Djream will render it with a React component.
      </>
    ),
  },
  {
    title: 'Don\'t give up what\'s great about Django',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Get the performance and user experience of a React SPA without giving up what's great about Django.

        Keep your business logic in Django views, use Django forms for validation, and
        test with Django test framework.
      </>
    ),
  },
  {
    title: 'Keep JavaScript bundles small',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Djream is 3.6KB minified, gzipped. As routing and business logic is handled by Django,
        your React app can be built with very few plugins.
      </>
    ),
  },
  {
    title: 'Create modal workflows with Django views',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Djream-enabled views can be opened in a modal instead of a new page.
        This makes it easy to create a modal workflows using Django views.
      </>
    ),
  },
  // {
  //   title: 'Intelligent dirty-form checking',
  //   Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       When users navigate away with unsaved changes, Djream will prompt them to
  //       confirm before leaving. This works for closing modals too.
  //     </>
  //   ),
  // },
  {
    title: 'Mix with traditional Django views',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You can use Djream-enabled views alongside traditional Django views in the
        same URL configuration and users can navigate between them. This makes it easier
        to migrate your app to Djream or use third-party apps that don't support Djream.
      </>
    ),
  },
  {
    title: 'Iterate fast with Vite hot reloading',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        If you use Vite to build your React app, Djream will automatically
        enable hot reloading in development.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
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
