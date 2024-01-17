import React from "react";
import { Message } from "./fetch";

export interface NavigateOptions {
  pushState?: boolean;
  skipDirtyFormCheck?: boolean;
}

export interface OpenModalOptions {
  onClose?: () => void;
  side?: "left" | "right";
}

export interface Navigation {
  frameId: number;
  path: string;
  props: Record<string, unknown>;
  navigate: (path: string, options?: NavigateOptions) => Promise<void>;
  pushFrame: (
    path: string,
    title: string,
    view: string,
    props: Record<string, unknown>,
    serverMessages: Message[],
    pushState?: boolean,
    reload?: boolean
  ) => void;
  replacePath: (frameId: number, path: string) => void;
  submitForm: (path: string, data: FormData) => Promise<void>;
  openModal: (path: string, options?: OpenModalOptions) => void;
  refreshProps: () => Promise<void>;
  pushMessage(message: Message): void;
}

export const NavigationContext = React.createContext<Navigation>({
  frameId: 0,
  path: "/",
  props: {},
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
  openModal: () => {
    // eslint-disable-next-line no-console
    console.error("openModal() called from outside a Djream Browser");

    throw new Error("Modal cannot be opened here");
  },
  refreshProps: () => {
    // eslint-disable-next-line no-console
    console.error("refreshProps() called from outside a Djream Browser");

    return Promise.resolve();
  },
  pushMessage() {},
});

// This context is used to allow form widgets to notify their forms that data has changed
export const FormWidgetChangeNotificationContext = React.createContext(
  () => {}
);

// This context is used to notify components within a form if the form is currently submitting
// This is used to display spinners in submit buttons
export const FormSubmissionStatus = React.createContext(false);
