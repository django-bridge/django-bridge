import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import Icon from "../../icons";
import { Message } from "../fetch";

const ToastMessagesContainer = styled.div`
    position: fixed;
    bottom: 50px;
    width: 100%;
    z-index: var(--z-index--toast-messages);
    pointer-events: none;
`;

const ToastMessagesWrapper = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
    transition: top 0.1s ease;
`;

const ToastMessageWrapper = styled.div<{ level: Message["level"] }>`
    padding: 14px 21px;
    text-align: center;
    border-radius: 5px;
    height: 45px;
    box-sizing: border-box;

    font-size: 14px;
    font-weight: 700;

    svg {
        display: inline;
        width: 16px;
        vertical-align: bottom;
        margin-right: 5px;
    }

    ${(props) => {
        if (props.level === "success") {
            return css`
                background-color: #bcebec;
                color: #251657;

                svg {
                    color: #251657;
                }
            `;
        }

        if (props.level === "warning") {
            return css`
                background-color: var(--color--amber-tint);
                color: #251657;

                svg {
                    color: var(--color--amber);
                }
            `;
        }

        if (props.level === "error") {
            return css`
                background-color: #ffdadd;
                color: var(--color--red);

                svg {
                    color: var(--color--red);
                }
            `;
        }

        return css``;
    }}

    // Fadeout animation
    animation: 5s ease 0s normal forwards 1 fadeout;
    @keyframes fadeout {
        0% {
            opacity: 1;
        }
        66% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;

interface ToastMessagesProps {
    messages: Message[];
}

function ToastMessages({ messages }: ToastMessagesProps): ReactElement {
    return (
        <ToastMessagesContainer>
            <ToastMessagesWrapper style={{ top: `-${messages.length * 55}px` }}>
                {messages.map((message) => {
                    const icon =
                        message.level === "success" ? (
                            <Icon name="fa/check-circle-solid" />
                        ) : (
                            <Icon name="fa/exclamation-triangle-solid" />
                        );

                    if ("html" in message) {
                        return (
                            <ToastMessageWrapper
                                level={message.level}
                                key={message.html}
                                role="alert"
                                aria-live={
                                    message.level === "error"
                                        ? "assertive"
                                        : "polite"
                                }
                            >
                                {icon}
                                <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                        __html: message.html,
                                    }}
                                />
                            </ToastMessageWrapper>
                        );
                    }

                    return (
                        <ToastMessageWrapper
                            level={message.level}
                            key={message.text}
                            role="alert"
                            aria-live={
                                message.level === "error"
                                    ? "assertive"
                                    : "polite"
                            }
                        >
                            {icon}
                            {message.text}
                        </ToastMessageWrapper>
                    );
                })}
            </ToastMessagesWrapper>
        </ToastMessagesContainer>
    );
}

export default ToastMessages;
