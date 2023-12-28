import React from "react";
import { ComponentMeta } from "@storybook/react";

import Button from "./Button";
import Icon from "../../icons";
import { FormSubmissionStatus } from "../../forms/contexts";

export default {
  title: "Components/Lib/Button",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Button,
} as ComponentMeta<typeof Button>;

export function Primary() {
  return (
    <Button type="button" onClick={() => {}}>
      Primary
    </Button>
  );
}

export function Secondary() {
  return (
    <Button type="button" kind="secondary" onClick={() => {}}>
      Secondary
    </Button>
  );
}

export function Danger() {
  return (
    <Button type="button" kind="danger" onClick={() => {}}>
      Danger
    </Button>
  );
}

export function WithIcon() {
  return (
    <Button type="button" onClick={() => {}}>
      <Icon name="fa/plus-circle-solid" />
      With an icon
    </Button>
  );
}

export function ManualWidth() {
  return (
    <Button type="button" style={{ width: "200px" }} onClick={() => {}}>
      Manual width
    </Button>
  );
}

export function Disabled() {
  return (
    <Button type="submit" disabled>
      Submit
    </Button>
  );
}

export function SecondaryDisabled() {
  return (
    <Button type="submit" kind="secondary" disabled>
      Submit
    </Button>
  );
}

export function DangerDisabled() {
  return (
    <Button type="submit" kind="danger" disabled>
      Submit
    </Button>
  );
}

export function PrimarySubmitting() {
  return (
    <FormSubmissionStatus.Provider value>
      <Button type="submit">Submit</Button>
    </FormSubmissionStatus.Provider>
  );
}

export function SecondarySubmitting() {
  return (
    <FormSubmissionStatus.Provider value>
      <Button type="submit" kind="secondary">
        Submit
      </Button>
    </FormSubmissionStatus.Provider>
  );
}

export function DangerSubmitting() {
  return (
    <FormSubmissionStatus.Provider value>
      <Button type="submit" kind="danger">
        Submit
      </Button>
    </FormSubmissionStatus.Provider>
  );
}
