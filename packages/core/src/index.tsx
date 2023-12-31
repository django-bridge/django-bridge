import React, { ReactElement, FunctionComponent, ReactNode } from "react";

import Browser from "./components/Browser";
import { Message, DjreamResponse } from "./fetch";
import { Frame, NavigationController } from "./navigation";
import { DirtyFormScope } from "./dirtyform";
import Link, { BuildLinkElement, buildLinkElement } from "./components/Link";

export interface AppProps {
    views: Map<string, FunctionComponent>;
    initialResponse: DjreamResponse;
    unpackContext(data: Record<string, unknown>): Record<string, unknown>;
    renderModal(
        contents: JSX.Element,
        side: "left" | "right",
        onClose: () => void,
        requestClose: boolean,
    ): ReactElement;
    renderMessages(messages: Message[]): ReactElement;
}

export function App({
    views,
    initialResponse,
    unpackContext,
    renderModal,
    renderMessages,
}: AppProps): ReactElement {
    const [navigationController] = React.useState(
        () => new NavigationController("browser", null, unpackContext)
    );
    const [modal, setModal] = React.useState<{
        navigationController: NavigationController;
        side: "left" | "right";
    } | null>(null);
    const [requestModalClose, setRequestModalClose] = React.useState(false);
    const modalCloseListener = React.useRef<(() => void) | null>(null);

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
            .handleResponse(initialResponse, window.location.pathname)
            .then(() => {
                // Remove the loading screen
                const loadingScreen = document.querySelector(".loading-screen");
                if (loadingScreen instanceof HTMLElement) {
                    loadingScreen.classList.add("loading-screen--hidden");
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
            void navigationController.navigate(
                document.location.pathname,
                false
            );
        };

        window.addEventListener("popstate", navigate);
        return () => {
            window.removeEventListener("popstate", navigate);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Call modal close listener if the modal has been closed
    React.useEffect(() => {
        if (modal === null && modalCloseListener.current) {
            modalCloseListener.current();
            modalCloseListener.current = null;
        }
    }, [modal]);

    // Add listener to raise any server errors that the modal navigation controller encounters
    React.useEffect(() => {
        if (modal) {
            modal.navigationController.addServerErrorListener(onServerError);

            return () => {
                modal.navigationController.removeServerErrorListener(
                    onServerError
                );
            };
        }

        return () => {};
    }, [modal, onServerError]);

    const openModal = (
        path: string,
        {
            onClose,
            side = "right",
        }: { onClose?: () => void; side?: "left" | "right" } = {}
    ) => {
        // Set up a new navigation controller
        const modalNavigationController = new NavigationController(
            "modal",
            navigationController,
            unpackContext
        );
        modalNavigationController.addNavigationListener(() => {
            // HACK: Update some state to force a re-render
            setRender(render + Math.random());
        });
        // eslint-disable-next-line no-void
        void modalNavigationController.navigate(path);

        // Add a listener to listen for when the modal is closed by the server
        modalNavigationController.addCloseListener(() =>
            setRequestModalClose(true)
        );

        if (onClose) {
            modalCloseListener.current = onClose;
        }

        setModal({
            navigationController: modalNavigationController,
            side,
        });
        setRequestModalClose(false);
    };

    // Close modal when we navigate the main window
    // We can force close in this situation, since we've already checked if there are any dirty forms
    React.useEffect(() => {
        const navigationListener = (
            _frame: Frame | null,
            newFrame: boolean
        ) => {
            // Only close modal if a new frame is being pushed
            // This prevents the modal from closing when refreshContext is called
            if (modal && newFrame) {
                setRequestModalClose(true);
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
                {renderMessages(messages)}
                {modal &&
                    modal.navigationController.currentFrame.view !==
                        "loading" && (
                        <DirtyFormScope>
                            {renderModal(
                                <Browser
                                    views={views}
                                    navigationController={
                                        modal.navigationController
                                    }
                                    openModal={() => {}}
                                    pushMessage={pushMessage}
                                />,
                                modal.side,
                                () => {
                                    setModal(null);
                                    setRequestModalClose(false);
                                },
                                requestModalClose
                            )}
                        </DirtyFormScope>
                    )}
                <Browser
                    views={views}
                    navigationController={navigationController}
                    openModal={(url, options) => openModal(url, options)}
                    pushMessage={pushMessage}
                />
            </DirtyFormScope>
        </div>
    );
}

export {
    NavigationContext,
    FormWidgetChangeNotificationContext,
    FormSubmissionStatus,
} from "./contexts";
export type { Navigation } from "./contexts";
export { DirtyFormContext, DirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";
export { NavigationController } from "./navigation";
export type { Frame } from "./navigation";
export type { DjreamResponse };
export { Link, BuildLinkElement, buildLinkElement };
export type { Message };
