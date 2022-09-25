import React, { useRef, ReactElement } from "react";
import styled, { keyframes } from "styled-components";
import FocusTrap from "focus-trap-react";
import { DirtyFormContext } from "../../forms/dirtyform";
import Icon from "../../icons";

export interface ModalWindowControls {
    isModal: boolean;
    close: (options?: { skipDirtyFormCheck?: boolean }) => void;
    setWarning: (warning: WarningMessage) => void;
}

interface WarningMessage {
    primary: string;
    details: string;
}

export const ModalWindowControlsContext =
    React.createContext<ModalWindowControls>({
        isModal: false,
        close: () => {
            // eslint-disable-next-line no-console
            console.error(
                "ModalWindowControls.close() called from outside a Modal"
            );
        },
        setWarning: () => {},
    });

const fadeInOverlay = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 0.5;
    }
`;

const fadeOutOverlay = keyframes`
    from {
        opacity: 0.5;
    }

    to {
        opacity: 0;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--z-index--modals);
    background-color: #000;
    opacity: 0.5;
    animation: ${fadeInOverlay} 0.2s ease;

    &.closing {
        animation: ${fadeOutOverlay} 0.2s ease;
        opacity: 0;
    }
`;

const slideInBodyFromLeft = keyframes`
    from {
        transform: translate(-100%, 0);
    }

    to {
        transform: none;
    }
`;

const slideOutBodyFromLeft = keyframes`
    from {
        transform: none;
    }

    to {
        transform: translate(-100%, 0);
    }
`;

const slideInBodyFromRight = keyframes`
    from {
        transform: translate(100%, 0);
    }

    to {
        transform: none;
    }
`;

const slideOutBodyFromRight = keyframes`
    from {
        transform: none;
    }

    to {
        transform: translate(100%, 0);
    }
`;

const ModalWindowWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: calc(var(--z-index--modals) + 1);
    overflow: hidden;

    &.left {
        animation: ${slideInBodyFromLeft} 0.2s ease;
    }

    &.left&.closing {
        animation: ${slideOutBodyFromLeft} 0.2s ease;
        transform: translate(100%, 0);
    }

    &.right {
        animation: ${slideInBodyFromRight} 0.2s ease;
    }

    &.right&.closing {
        animation: ${slideOutBodyFromRight} 0.2s ease;
        transform: translate(100%, 0);
    }
`;

const ModalLayout = styled.div`
    display: flex;

    ${ModalWindowWrapper}.left & {
        flex-flow: row-reverse nowrap;
    }

    ${ModalWindowWrapper}.right & {
        flex-flow: row nowrap;
    }
`;

const ModalBody = styled.div`
    box-sizing: border-box;
    padding: 0;
    z-index: calc(var(--z-index--modals) + 10);
    height: 100vh;
    max-width: 650px;
    background-color: var(--color--white);
    display: flex;
    flex-direction: column;

    ${ModalWindowWrapper}.left & {
        margin-right: auto;
    }

    ${ModalWindowWrapper}.right & {
        margin-left: auto;
    }
`;

const BaseWarningWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 20px;
    padding: 15px 20px;
    color: var(--color--indigo);
    font-size: 15px;
    font-weight: 400;
    margin-top: 0;

    svg {
        height: 18px;
        flex-shrink: 0;
    }

    p {
        line-height: 19.5px;
    }

    strong {
        font-weight: 700;
    }
`;

const slideInUnsavedChangesWarning = keyframes`
    from {
        margin-top: -50px;
    }

    to {
        margin-top: 0
    }
`;

const UnsavedChangesWarningWrapper = styled(BaseWarningWrapper)`
    background-color: #ffdadd;
    animation: ${slideInUnsavedChangesWarning} 0.5s ease;

    svg {
        color: var(--color--red);
    }
`;

const CautionWarningWrapper = styled(BaseWarningWrapper)`
    background-color: var(--color--amber-tint);

    svg {
        color: #ffb800;
    }
`;

const ModalContent = styled.div`
    position: relative;
    overflow: auto;
`;

let nextModalId = 1;

interface ModalWindowProps {
    side: "left" | "right";
    onClose(): void;
    requestClose?: boolean;
}

function ModalWindow({
    children,
    side,
    onClose,
    requestClose = false,
}: React.PropsWithChildren<ModalWindowProps>): ReactElement {
    const id = useRef<string | null>(null);
    if (!id.current) {
        id.current = `modal-${nextModalId}`;
        nextModalId += 1;
    }

    // Custom warning message
    // TODO: implement this in a better way?
    const [warning, setWarning] = React.useState<WarningMessage | null>(null);

    // Closing state
    const [closing, setClosing] = React.useState(false);
    React.useEffect(() => {
        if (closing) {
            const timeout = setTimeout(onClose, 200);

            return () => {
                clearTimeout(timeout);
            };
        }

        return () => {};
    });

    const dirtyFormContext = React.useContext(DirtyFormContext);

    const requestCloseCallback = React.useCallback(() => {
        if (dirtyFormContext.isDirty) {
            // eslint-disable-next-line no-void
            void dirtyFormContext.requestUnload().then(() => setClosing(true));
        } else {
            setClosing(true);
        }
    }, [dirtyFormContext]);

    // If parent component requests close, then close.
    React.useEffect(() => {
        if (requestClose) {
            setClosing(true);
        }
    }, [requestClose, requestCloseCallback]);

    const ModalWindowControls = React.useMemo(
        () => ({
            isModal: true,
            close: ({ skipDirtyFormCheck = false } = {}) => {
                if (skipDirtyFormCheck) {
                    setClosing(true);
                } else {
                    requestCloseCallback();
                }
            },
            setWarning,
        }),
        [requestCloseCallback]
    );

    // Close modal on click outside
    const bodyRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const clickEventListener = (e: MouseEvent) => {
            // Close modal on click outside
            if (
                bodyRef.current &&
                e.target instanceof HTMLElement &&
                !bodyRef.current.contains(e.target)
            ) {
                e.preventDefault();
                requestCloseCallback();
            }
        };

        document.body.addEventListener("mouseup", clickEventListener);

        return () => {
            document.body.removeEventListener("mouseup", clickEventListener);
        };
    }, [requestCloseCallback]);

    React.useEffect(() => {
        const keydownEventListener = (e: KeyboardEvent) => {
            // Close modal on click escape
            if (e.key === "Escape") {
                e.preventDefault();
                requestCloseCallback();
            }
        };

        document.addEventListener("keydown", keydownEventListener);

        return () => {
            document.removeEventListener("keydown", keydownEventListener);
        };
    });

    return (
        <>
            <ModalOverlay className={closing ? "closing" : ""} />
            <ModalWindowWrapper
                role="dialog"
                aria-modal
                aria-hidden={false}
                aria-labelledby={`${id.current}-title`}
                className={side + (closing ? " closing" : "")}
            >
                <ModalWindowControlsContext.Provider
                    value={ModalWindowControls}
                >
                    <FocusTrap>
                        <ModalLayout>
                            <ModalBody ref={bodyRef}>
                                {dirtyFormContext.unloadRequested && (
                                    <UnsavedChangesWarningWrapper
                                        role="alert"
                                        aria-live="assertive"
                                    >
                                        <Icon name="fa/exclamation-triangle-solid" />
                                        <p>
                                            <strong>
                                                You have unsaved changes.
                                            </strong>{" "}
                                            Please save or cancel before closing
                                        </p>
                                    </UnsavedChangesWarningWrapper>
                                )}
                                {warning && (
                                    <CautionWarningWrapper>
                                        <Icon name="fa/exclamation-triangle-solid" />
                                        <p>
                                            <strong>{warning.primary}</strong>{" "}
                                            {warning.details}
                                        </p>
                                    </CautionWarningWrapper>
                                )}
                                <ModalContent>{children}</ModalContent>
                            </ModalBody>
                        </ModalLayout>
                    </FocusTrap>
                </ModalWindowControlsContext.Provider>
            </ModalWindowWrapper>
        </>
    );
}

export default ModalWindow;
