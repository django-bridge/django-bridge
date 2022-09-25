import React, { ReactElement, FunctionComponent } from "react";
import styled from "styled-components";
// eslint-disable-next-line import/no-extraneous-dependencies
import produce from "immer";

import Browser from "./components/Browser";
import ToastMessages from "./components/ToastMessages";
import ModalWindow from "./components/ModalWindow";
import { Message, ShellResponse } from "./fetch";

import { NavigationController } from "./navigation";
import { DirtyFormScope } from "../forms/dirtyform";
import { ShellGlobals, ShellGlobalsContext } from "./contexts";

export interface ShellProps {
    views: Map<string, FunctionComponent>;
    initialResponse: ShellResponse;
    globals: ShellGlobals;
}

const ShellWrapper = styled.div`
    height: 100vh;
`;

const BrowserWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const AvatarWrapper = styled.div`
    position: fixed;
    left: 25px;
    bottom: 25px;

    button {
        background: none;
        padding: 0;
        border: none;

        &:hover {
            cursor: pointer;
        }
    }

    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
`;

function Shell({ views, initialResponse, globals }: ShellProps): ReactElement {
    const [navigationController] = React.useState(
        () => new NavigationController("browser", null)
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
            setMessages(
                produce(messages, (draft) => {
                    draft.push(message);
                })
            );
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

        return () => { };
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
            navigationController
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
        const navigationListener = () => {
            if (modal) {
                setRequestModalClose(true);
            }
        };

        navigationController.addNavigationListener(navigationListener);

        return () => {
            navigationController.removeNavigationListener(navigationListener);
        };
    });

    return (
        <ShellWrapper>
            <ShellGlobalsContext.Provider value={globals}>
                <DirtyFormScope handleBrowserUnload>
                    <ToastMessages messages={messages} />
                    {modal &&
                        modal.navigationController.currentFrame.view !==
                        "loading" && (
                            <DirtyFormScope>
                                <ModalWindow
                                    side={modal.side}
                                    onClose={() => {
                                        setModal(null);
                                        setRequestModalClose(false);
                                    }}
                                    requestClose={requestModalClose}
                                >
                                    <Browser
                                        views={views}
                                        navigationController={
                                            modal.navigationController
                                        }
                                        openModal={() => { }}
                                        pushMessage={pushMessage}
                                    />
                                </ModalWindow>
                            </DirtyFormScope>
                        )}
                    <BrowserWrapper>
                        <Browser
                            views={views}
                            navigationController={navigationController}
                            openModal={(url, options) =>
                                openModal(url, options)
                            }
                            pushMessage={pushMessage}
                        />
                        <AvatarWrapper>
                            <button
                                type="button"
                                onClick={() =>
                                    openModal(globals.urls.userProfile, {
                                        side: "left",
                                    })
                                }
                            >
                                <img
                                    src={globals.user.avatarUrl}
                                    alt="Account Settings"
                                />
                            </button>
                        </AvatarWrapper>
                    </BrowserWrapper>
                </DirtyFormScope>
            </ShellGlobalsContext.Provider>
        </ShellWrapper>
    );
}

export default Shell;
