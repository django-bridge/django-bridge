import React, { ReactElement } from "react";
import { DirtyFormContext, DirtyFormMarker } from "../dirtyform";
import {
  NavigationContext,
  FormSubmissionStatus,
  FormWidgetChangeNotificationContext,
} from "../contexts";

interface FormProps extends React.HTMLProps<HTMLFormElement> {
  isDirty?: boolean;
  disableDirtyCheck?: boolean;
}

export function Form({
  children,
  onSubmit: callerOnSubmit,
  isDirty: isInitiallyDirty = false,
  disableDirtyCheck = false,
  ...props
}: FormProps): ReactElement {
  const { submitForm, navigate } = React.useContext(NavigationContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(isInitiallyDirty);
  const { cancelUnload } = React.useContext(DirtyFormContext);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isDirty) {
      cancelUnload();
    }

    if (callerOnSubmit) {
      callerOnSubmit(e);

      if (e.defaultPrevented) {
        return;
      }
    }

    if (e.target instanceof HTMLFormElement) {
      // Don't submit if already submitting
      if (isSubmitting) {
        e.preventDefault();
        return;
      }

      // Get form data
      const data = new FormData(e.target);

      // Add name/value from submitter
      if (e.nativeEvent instanceof SubmitEvent && e.nativeEvent.submitter) {
        const { submitter } = e.nativeEvent;
        if (
          (submitter instanceof HTMLButtonElement ||
            submitter instanceof HTMLInputElement) &&
          submitter.name &&
          submitter.value
        ) {
          data.set(submitter.name, submitter.value);
        }
      }

      // Submit the form in the background
      if (e.target.method === "post") {
        e.preventDefault();
        setIsSubmitting(true);

        // Note: Don't need to switch setIsSubmitting back to false on .then(), since the Form should be unmounted at that point
        // eslint-disable-next-line no-void
        void submitForm(e.target.action, data).catch(() =>
          setIsSubmitting(false)
        );
      } else if (e.target.method === "get") {
        e.preventDefault();
        // TODO: Make sure there are no files here
        const dataString = Array.from(data.entries())
          .map(
            (x) =>
              `${encodeURIComponent(x[0])}=${encodeURIComponent(
                x[1] as string
              )}`
          )
          .join("&");

        const path =
          e.target.action +
          (e.target.action.indexOf("?") === -1 ? "?" : "&") +
          dataString;

        setIsSubmitting(true);

        // Note: Don't need to switch setIsSubmitting back to false on .then(), since the Form should be unmounted at that point
        // eslint-disable-next-line no-void
        void navigate(path).catch(() => setIsSubmitting(false));
      }
    }
  };

  const formWidgetChangeNotificationCallback = React.useCallback(() => {
    setIsDirty(true);
  }, []);

  return (
    <form onSubmit={onSubmit} {...props}>
      {isDirty && !disableDirtyCheck && <DirtyFormMarker />}
      <FormSubmissionStatus.Provider value={isSubmitting}>
        <FormWidgetChangeNotificationContext.Provider
          value={formWidgetChangeNotificationCallback}
        >
          {children}
        </FormWidgetChangeNotificationContext.Provider>
      </FormSubmissionStatus.Provider>
    </form>
  );
}
