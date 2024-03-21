import React, { ReactElement, FunctionComponent, ReactNode } from "react";

import Browser from "./components/Browser";
import { Message, DjangoRenderResponse } from "./fetch";
import { Frame, NavigationController } from "./navigation";
import { DirtyFormScope } from "./dirtyform";
import Link, { BuildLinkElement, buildLinkElement } from "./components/Link";
import { Config } from "./config";
import { MessagesContext } from "./contexts";

export interface AppProps {
  config: Config;
  initialResponse: DjangoRenderResponse | JSON;
}

export function App({ config, initialResponse }: AppProps): ReactElement {
  const [navigationController] = React.useState(
    () => new NavigationController(null, config.unpack)
  );
  const [overlay, setOverlay] = React.useState<{
    navigationController: NavigationController;
    render(
      content: ReactNode,
      onClose: () => void,
      requestClose: boolean
    ): ReactNode;
  } | null>(null);
  const [requestModalClose, setRequestOverlayClose] = React.useState(false);
  const overlayCloseListener = React.useRef<(() => void) | null>(null);

  const [render, setRender] = React.useState(0);

  // Toast messages
  const [messages, setMessages] = React.useState<Message[]>([]);
  const pushMessage = React.useCallback(
    (message: Message) => {
      setMessages(messages.concat([message]));
    },
    [messages]
  );

  const onServerError = React.useCallback(
    (kind: "server" | "network") => {
      if (kind === "server") {
        pushMessage({
          level: "error",
          text: "A server error occurred. Please try again later.",
        });
      } else if (kind === "network") {
        pushMessage({
          level: "error",
          text: "A network error occurred. Please check your internet connection or try again later.",
        });
      }
    },
    [pushMessage]
  );

  React.useEffect(() => {
    // Add listener to re-render the app if a navigation event occurs
    navigationController.addNavigationListener(() => {
      // HACK: Update some state to force a re-render
      setRender(render + Math.random());
    });

    // Handle initial response
    // eslint-disable-next-line no-void
    void navigationController
      .handleResponse(
        initialResponse as DjangoRenderResponse,
        window.location.pathname
      )
      .then(() => {
        // Remove the loading screen
        const loadingScreen = document.querySelector(".djangorender-load");
        if (loadingScreen instanceof HTMLElement) {
          loadingScreen.classList.add("djangorender-load--hidden");
          setTimeout(() => {
            loadingScreen.remove();
          }, 200);
        }
      });

    // Add listener to raise any server errors that the navigation controller encounters
    navigationController.addServerErrorListener(onServerError);

    // Add listener for popState
    // This event is fired when the user hits the back/forward links in their browser
    const navigate = () => {
      // eslint-disable-next-line no-void
      void navigationController.navigate(document.location.pathname, false);
    };

    window.addEventListener("popstate", navigate);
    return () => {
      window.removeEventListener("popstate", navigate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Call overlay close listener if the overlay has been closed
  React.useEffect(() => {
    if (overlay === null && overlayCloseListener.current) {
      overlayCloseListener.current();
      overlayCloseListener.current = null;
    }
  }, [overlay]);

  // Add listener to raise any server errors that the overlay navigation controller encounters
  React.useEffect(() => {
    if (overlay) {
      overlay.navigationController.addServerErrorListener(onServerError);

      return () => {
        overlay.navigationController.removeServerErrorListener(onServerError);
      };
    }

    return () => {};
  }, [overlay, onServerError]);

  const openOverlay = (
    path: string,
    renderOverlay: (
      content: ReactNode,
      onClose: () => void,
      requestClose: boolean
    ) => ReactNode,
    { onClose }: { onClose?: () => void } = {}
  ) => {
    // Set up a new navigation controller
    const overlayNavigationController = new NavigationController(
      navigationController,
      config.unpack
    );
    overlayNavigationController.addNavigationListener(() => {
      // HACK: Update some state to force a re-render
      setRender(render + Math.random());
    });
    // eslint-disable-next-line no-void
    void overlayNavigationController.navigate(path);

    // Add a listener to listen for when the overlay is closed by the server
    overlayNavigationController.addCloseListener(() =>
      setRequestOverlayClose(true)
    );

    if (onClose) {
      overlayCloseListener.current = onClose;
    }

    setOverlay({
      navigationController: overlayNavigationController,
      render: renderOverlay,
    });
    setRequestOverlayClose(false);
  };

  // Close overlay when we navigate the main window
  // We can force close in this situation, since we've already checked if there are any dirty forms
  React.useEffect(() => {
    const navigationListener = (_frame: Frame | null, newFrame: boolean) => {
      // Only close overlay if a new frame is being pushed
      // This prevents the overlay from closing when refreshProps is called
      if (overlay && newFrame) {
        setRequestOverlayClose(true);
      }
    };

    navigationController.addNavigationListener(navigationListener);

    return () => {
      navigationController.removeNavigationListener(navigationListener);
    };
  });

  return (
    <div>
      <DirtyFormScope handleBrowserUnload>
        <MessagesContext.Provider value={{ messages, pushMessage }}>
          {overlay &&
            overlay.navigationController.currentFrame.view !== "loading" && (
              <DirtyFormScope>
                {overlay.render(
                  <Browser
                    views={config.views}
                    navigationController={overlay.navigationController}
                    openOverlay={() => {}}
                  />,
                  () => {
                    setOverlay(null);
                    setRequestOverlayClose(false);
                  },
                  requestModalClose
                )}
              </DirtyFormScope>
            )}
          <Browser
            views={config.views}
            navigationController={navigationController}
            openOverlay={(url, render, options) =>
              openOverlay(url, render, options)
            }
          />
        </MessagesContext.Provider>
      </DirtyFormScope>
    </div>
  );
}

export {
  NavigationContext,
  OverlayContext,
  FormWidgetChangeNotificationContext,
  FormSubmissionStatus,
  MessagesContext,
} from "./contexts";
export type { Navigation } from "./contexts";
export { DirtyFormContext, DirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";
export { NavigationController } from "./navigation";
export type { Frame } from "./navigation";
export type { DjangoRenderResponse as Response };
export { Link, BuildLinkElement, buildLinkElement };
export type { Message };
export { Config };
export { Form } from "./components/Form";
