import React, { ReactElement, ReactNode } from "react";
import Config from "../config";
import { OverlayContext, OverlayContextType } from "../contexts";
import { DirtyFormContext } from "../dirtyform";
import { NavigationController } from "../navigation";
import Browser from "./Browser";
import { DjangoRenderResponse } from "../fetch";

export interface OverlayProps {
  config: Config;
  initialResponse: DjangoRenderResponse;
  initialPath: string;
  parentNavigationContoller: NavigationController;
  render: (content: ReactNode) => ReactNode;
  requestClose: () => void;
  closeRequested: boolean;
  onCloseCompleted: () => void;
  onServerError: (kind: "server" | "network") => void;
}

export default function Overlay({
  config,
  initialResponse,
  initialPath,
  parentNavigationContoller,
  render,
  requestClose,
  closeRequested,
  onCloseCompleted,
  onServerError,
}: OverlayProps): ReactElement {
  const [navigationController] = React.useState(
    () => new NavigationController(parentNavigationContoller, config.unpack)
  );

  const [forceRender, setForceRender] = React.useState(0);
  React.useEffect(() => {
    // Add listener to re-render the app if a navigation event occurs
    navigationController.addNavigationListener(() => {
      // HACK: Update some state to force a re-render
      setForceRender(forceRender + Math.random());
    });

    // Load initial response
    // eslint-disable-next-line no-void
    void navigationController.handleResponse(initialResponse, initialPath);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add a listener to listen for when the overlay is closed by the server
  React.useEffect(() => {
    navigationController.addCloseListener(requestClose);

    return () => {
      navigationController.removeCloseListener(requestClose);
    };
  }, [navigationController, requestClose]);

  // Add listener to raise any server errors that the overlay navigation controller encounters
  React.useEffect(() => {
    navigationController.addServerErrorListener(onServerError);

    return () => {
      navigationController.removeServerErrorListener(onServerError);
    };
  }, [navigationController, onServerError]);

  // If close is requested, but there is a dirty form (form without saved changes) in the overlay, block the close
  const dirtyFormContext = React.useContext(DirtyFormContext);
  const requestCloseCallback = React.useCallback(
    ({ skipDirtyFormCheck = false }: { skipDirtyFormCheck?: boolean } = {}) => {
      if (!skipDirtyFormCheck && dirtyFormContext.isDirty) {
        // eslint-disable-next-line no-void
        void dirtyFormContext.requestUnload().then(() => requestClose());
      } else {
        requestClose();
      }
    },
    [dirtyFormContext, requestClose]
  );

  const overlayContext: OverlayContextType = React.useMemo(
    () => ({
      overlay: true,
      closeRequested,
      closeBlocked: closeRequested && dirtyFormContext.isDirty,
      requestClose: requestCloseCallback,
      onCloseCompleted,
    }),
    [
      closeRequested,
      dirtyFormContext.isDirty,
      onCloseCompleted,
      requestCloseCallback,
    ]
  );

  if (navigationController.isLoading()) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <OverlayContext.Provider value={overlayContext}>
      {render(
        <Browser
          config={config}
          navigationController={navigationController}
          openOverlay={() => {}}
        />
      )}
    </OverlayContext.Provider>
  );
}
