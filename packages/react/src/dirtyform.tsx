import React from "react";

// This context is used by the ModalWindow and Browser components to detect if they contain
// a dirty form and provide some state to manage a confirmation message
const DirtyFormMarkerCallbackContext = React.createContext(() => {});
export interface DirtyForm {
  isDirty: boolean;

  requestUnload: () => Promise<unknown>;
  unloadRequested: boolean;
  unloadBlocked: boolean;

  confirmUnload: () => void;
  cancelUnload: () => void;
  unloadConfirmed: boolean;
}
export const DirtyFormContext = React.createContext<DirtyForm>({
  isDirty: false,

  requestUnload: () => Promise.resolve(),
  unloadRequested: false,
  unloadBlocked: false,

  confirmUnload: () => {},
  cancelUnload: () => {},
  unloadConfirmed: false,
});

interface DirtyFormScopeProps {
  handleBrowserUnload?: boolean;
}

// Catches any dirty form alerts raised by form widgets in a given part of the DOM tree
// Provides the current dirty form status to all children and some state to manage a confirmation message when navigating away without saving
export function DirtyFormScope({
  handleBrowserUnload = false,
  children,
}: React.PropsWithChildren<DirtyFormScopeProps>): React.ReactElement {
  const [unloadRequested, setUnloadRequested] = React.useState<boolean>(false);
  const [unloadCallback, setUnloadCallback] = React.useState<{
    cb: (value: void) => void;
  }>({ cb: () => {} });
  const [unloadConfirmed, setUnloadConfirmed] = React.useState<boolean>(false);

  // Check if an instance of DirtyFormMarker exists in the sub tree
  // Note that isDirty will be set to True when a DirtyFormMarker is mounted, but it is not reset when its unmounted
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  const ref = React.useRef<null | HTMLDivElement>(null);
  const checkIsDirty = () =>
    (ref.current && !!ref.current.querySelector("div.dirty-form-marker")) ||
    false;

  // If this is the root scope, add a beforeunload handler if there is a dirty form
  React.useEffect(() => {
    if (handleBrowserUnload && isDirty) {
      const message = "This page has unsaved changes.";
      const beforeUnloadHandler = (event: { returnValue: string }) => {
        if (!checkIsDirty()) {
          return "";
        }
        event.returnValue = message;
        return message;
      };
      window.addEventListener("beforeunload", beforeUnloadHandler);

      return () => {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      };
    }
    return () => {};
  }, [handleBrowserUnload, isDirty]);

  // When an instance of DirtyFormMarker is mounted in the DOM, update isDirty
  const superDirtyFormMarkerCallback = React.useContext(
    DirtyFormMarkerCallbackContext
  );
  const dirtyFormMarkerCallback = React.useCallback(() => {
    setIsDirty(checkIsDirty());
    superDirtyFormMarkerCallback();
  }, [superDirtyFormMarkerCallback]);

  // Create a dirty form context to pass down
  const dirtyFormContext = React.useMemo(
    () => ({
      isDirty,
      requestUnload: () => {
        // Note: isDirty may be incorrect if there was a dirty form that has been removed
        if (isDirty && checkIsDirty()) {
          setUnloadRequested(true);

          return new Promise((resolve) => {
            setUnloadCallback({ cb: resolve });
          });
        }

        return Promise.resolve();
      },
      unloadRequested,
      unloadBlocked: isDirty && unloadRequested,
      confirmUnload: () => {
        if (unloadRequested) {
          setUnloadConfirmed(true);
          unloadCallback.cb();
          setUnloadRequested(false);
          setUnloadCallback({ cb: () => {} });
        }
      },
      cancelUnload: () => {
        if (unloadRequested) {
          setUnloadRequested(false);
          setUnloadCallback({ cb: () => {} });
        }
      },
      unloadConfirmed,
    }),
    [isDirty, unloadCallback, unloadConfirmed, unloadRequested]
  );

  return (
    <div ref={ref}>
      <DirtyFormMarkerCallbackContext.Provider value={dirtyFormMarkerCallback}>
        <DirtyFormContext.Provider value={dirtyFormContext}>
          {children}
        </DirtyFormContext.Provider>
      </DirtyFormMarkerCallbackContext.Provider>
    </div>
  );
}

// This element should be added into the DOM by a form to signal to the DirtyFormScope that it is dirty
export function DirtyFormMarker(): React.ReactElement {
  const callback = React.useContext(DirtyFormMarkerCallbackContext);
  React.useEffect(callback);

  return <div className="dirty-form-marker" style={{ display: "none" }} />;
}
