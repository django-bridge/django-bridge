import React, { ReactElement, ReactNode } from "react";
import Config from "../config";
import { OverlayContext, OverlayContextType } from "../contexts";
import { DirtyFormContext } from "../dirtyform";
import { NavigationController } from "../navigation";
import Browser from "./Browser";

export interface OverlayProps {
  config: Config;
  navigationController: NavigationController;
  render: (content: ReactNode) => ReactNode;
  requestClose: () => void;
  closeRequested: boolean;
  onCloseCompleted: () => void;
}

export default function Overlay({
  config,
  navigationController,
  render,
  requestClose,
  closeRequested,
  onCloseCompleted,
}: OverlayProps): ReactElement {
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
