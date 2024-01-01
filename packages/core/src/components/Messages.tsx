import React, { ReactElement } from "react";
import styled, { css } from "styled-components";
import { Message } from "../fetch";
import Icon from "./Icon";

const ToastMessagesContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  width: 100%;
  z-index: 1000;
  pointer-events: none;
`;

const ToastMessagesWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
  transition: top 0.1s ease;
`;

const ToastMessageWrapper = styled.div<{
  level: Message["level"];
  noFade?: boolean;
}>`
  padding: 0.5rem 1rem;
  text-align: center;
  border-radius: 0.5rem;
  box-sizing: border-box;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 0.5rem;
  }

  ${(props) => {
    if (props.level === "success") {
      return css`
        background-color: #afe7d0;
        color: #192a3c;

        svg {
          color: #192a3c;
        }
      `;
    }

    if (props.level === "warning") {
      return css`
        background-color: #faecd5;
        color: #192a3c;

        svg {
          color: #e9b04d;
        }
      `;
    }

    if (props.level === "error") {
      return css`
        background-color: #ffdadd;
        color: #192a3c;

        svg {
          color: #c02330;
        }
      `;
    }

    return css``;
  }}

  // Fadeout animation
  ${({ noFade }) => {
    if (!noFade) {
      return css`
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
    }
    return css``;
  }}
`;

interface ToastMessageProps {
  message: Message;
  noFade?: boolean;
}

export function ToastMessage({
  message,
  noFade,
}: ToastMessageProps): ReactElement {
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
        noFade={noFade}
        role="alert"
        aria-live={message.level === "error" ? "assertive" : "polite"}
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
      noFade={noFade}
      role="alert"
      aria-live={message.level === "error" ? "assertive" : "polite"}
    >
      {icon}
      {message.text}
    </ToastMessageWrapper>
  );
}

interface ToastMessagesProps {
  messages: Message[];
}

function ToastMessages({ messages }: ToastMessagesProps): ReactElement {
  return (
    <ToastMessagesContainer>
      <ToastMessagesWrapper style={{ top: `-${messages.length * 55}px` }}>
        {messages.map((message) => (
          <ToastMessage key={message.toString()} message={message} />
        ))}
      </ToastMessagesWrapper>
    </ToastMessagesContainer>
  );
}

export default ToastMessages;
