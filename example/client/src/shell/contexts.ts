import React from "react";
import { createTestUser } from "../users/testdata";
import { User } from "../users/types";
import { Message } from "./fetch";

export interface NavigateOptions {
    pushState?: boolean;
    skipDirtyFormCheck?: boolean;
}

export interface OpenModalOptions {
    onClose?: () => void;
    side?: "left" | "right";
}

export interface ShellNavigation {
    frameId: number;
    path: string;
    navigate: (path: string, options?: NavigateOptions) => Promise<void>;
    pushFrame: (
        path: string,
        title: string,
        view: string,
        context: Record<string, unknown>,
        serverMessages: Message[],
        pushState?: boolean,
        reload?: boolean
    ) => void;
    replacePath: (frameId: number, path: string) => void;
    submitForm: (path: string, data: FormData) => Promise<void>;
    openModal: (path: string, options?: OpenModalOptions) => void;
    refreshContext: () => Promise<void>;
    pushMessage(message: Message): void;
}

export const ShellNavigationContext = React.createContext<ShellNavigation>({
    frameId: 0,
    path: "/",
    navigate: () => {
        // eslint-disable-next-line no-console
        console.error("navigate() called from outside a Shell Browser");

        return Promise.resolve();
    },
    pushFrame: () => {
        // eslint-disable-next-line no-console
        console.error("pushFrame() called from outside a Shell Browser");
    },
    replacePath: () => {
        // eslint-disable-next-line no-console
        console.error("replacePath() called from outside a Shell Browser");
    },
    submitForm: () => {
        // eslint-disable-next-line no-console
        console.error("submitForm() called from outside a Shell Browser");

        return Promise.resolve();
    },
    openModal: () => {
        // eslint-disable-next-line no-console
        console.error("openModal() called from outside a Shell Browser");

        throw new Error("Modal cannot be opened here");
    },
    refreshContext: () => {
        // eslint-disable-next-line no-console
        console.error("refreshContext() called from outside a Shell Browser");

        return Promise.resolve();
    },
    pushMessage() {},
});

export interface ShellGlobals {
    user: User;
    urls: {
        userProfile: string;
        logout: string;
    };
}

export const ShellGlobalsContext = React.createContext<ShellGlobals>({
    user: createTestUser(),
    urls: {
        userProfile: "#",
        logout: "#",
    },
});
