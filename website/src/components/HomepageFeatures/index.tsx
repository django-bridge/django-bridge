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
    title: 'Seamless Django Integration',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Use Django's URL patterns and views. No need to create a REST/GraphQL API.
        Djream-enabled views return JSON that is converted to props
        and rendered by your React app.
      </>
    ),
  },
  {
    title: 'Extremely lightweight React frontends',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Routing is handled by Django, so your React app can
        be built with very few plugins. Djream is only 10KB minified JS.
      </>
    ),
  },
  {
    title: 'Open URLs in Modals',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Djream-enabled views can be opened  a modal instead of a new page.
        This makes it easy to create a modal workflows using Django views.
      </>
    ),
  },
  {
    title: 'Intelligent dirty-form checking',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        When users navigate away with unsaved changes, Djream will prompt them to
        confirm before leaving. This works for closing modals too.
      </>
    ),
  },
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
    title: 'Hot reloading with Vite',
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
