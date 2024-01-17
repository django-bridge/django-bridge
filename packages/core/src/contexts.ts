import React, { ReactNode } from "react";
import { Message } from "./fetch";

export interface NavigateOptions {
  pushState?: boolean;
  skipDirtyFormCheck?: boolean;
}

export interface OpenOverlayOptions {
  onClose?: () => void;
}

export interface OverlayContextType {
  overlay: boolean;
  close: (options?: { skipDirtyFormCheck?: boolean }) => void;
}

export const OverlayContext =
  React.createContext<OverlayContextType>({
    overlay: false,
    close: () => {
      // eslint-disable-next-line no-console
      console.error("OverlayContext.close() called from outside an overlay");
    },
  });

export interface Navigation {
  frameId: number;
  path: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  navigate: (path: string, options?: NavigateOptions) => Promise<void>;
  pushFrame: (
    path: string,
    title: string,
    view: string,
    props: Record<string, unknown>,
    context: Record<string, unknown>,
    serverMessages: Message[],
    pushState?: boolean,
    reload?: boolean
  ) => void;
  replacePath: (frameId: number, path: string) => void;
  submitForm: (path: string, data: FormData) => Promise<void>;
  openOverlay: (path: string, render: (content: ReactNode, onClose: () => void, requestClose: boolean) => ReactNode, options?: OpenOverlayOptions) => void;
  refreshProps: () => Promise<void>;
}

export const NavigationContext = React.createContext<Navigation>({
  frameId: 0,
  path: "/",
  props: {},
  context: {},
  navigate: () => {
    // eslint-disable-next-line no-console
    console.error("navigate() called from outside a Djream Browser");

    return Promise.resolve();
  },
  pushFrame: () => {
    // eslint-disable-next-line no-console
    console.error("pushFrame() called from outside a Djream Browser");
  },
  replacePath: () => {
    // eslint-disable-next-line no-console
    console.error("replacePath() called from outside a Djream Browser");
  },
  submitForm: () => {
    // eslint-disable-next-line no-console
    console.error("submitForm() called from outside a Djream Browser");

    return Promise.resolve();
  },
  openOverlay: () => {
    // eslint-disable-next-line no-console
    console.error("openOverlay() called from outside a Djream Browser");

    throw new Error("Modal cannot be opened here");
  },
  refreshProps: () => {
    // eslint-disable-next-line no-console
    console.error("refreshProps() called from outside a Djream Browser");

    return Promise.resolve();
  },
});

// This context is used to allow form widgets to notify their forms that data has changed
export const FormWidgetChangeNotificationContext = React.createContext(
  () => {}
);

// This context is used to notify components within a form if the form is currently submitting
// This is used to display spinners in submit buttons
export const FormSubmissionStatus = React.createContext(false);

export interface Messages {
  messages: Message[];
  pushMessage: (message: Message) => void;
}

export const MessagesContext = React.createContext<Messages>({
  messages: [],
  pushMessage: () => {},
})
