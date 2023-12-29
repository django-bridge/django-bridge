import styles from './styles.module.css';
import Step1 from '../../../docs/landing-intro/Step1.md'
import Step2 from '../../../docs/landing-intro/Step2.md';
import Step3 from '../../../docs/landing-intro/Step3.md';

const steps = [
  {
    title: "Create a Djream-enabled view",
    description: "Djream-enabled views return a DjreamResponse, that takes a component name and dictionary of props. Props can contain any JSON serializable value or object that has a JavaScript equivalent class.",
    code: <Step1 />
  },
  {
    title: "Create a React component to render the view",
    description: "The component will receive the props from the DjreamResponse.",
    code: <Step2 />
  },
  {
    title: "Add the component to App.jsx",
    description: "Add the component to the views map in App.jsx.",
    code: <Step3 />
  }
];

export default function HomepageCodeExample(): JSX.Element {
  return (
    <section className={styles.codeexample}>
      {steps.map((step, idx) => (
        <div className={styles.step} key={idx}>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          <pre>{step.code}</pre>
        </div>
      ))}
    </section>
  );
}
