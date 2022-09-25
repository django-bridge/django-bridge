/* eslint-disable @typescript-eslint/no-explicit-any */

export type Mode = "browser" | "modal";

export interface TextMessage {
    level: "success" | "warning" | "error";
    text: string;
}

export interface HTMLMessage {
    level: "success" | "warning" | "error";
    html: string;
}

export type Message = TextMessage | HTMLMessage;

interface ShellResponseLoadIt {
    status: "load-it";
}

interface ShellResponseRedirect {
    status: "redirect";
    path: string;
}

interface ShellResponseRender {
    status: "render";
    mode: Mode;
    title: string;
    view: string;
    context: any;
    messages: Message[];
}

interface ShellResponseCloseModal {
    status: "close-modal";
}

interface ShellResponseServerError {
    status: "server-error";
}

interface ShellResponseNetworkError {
    status: "network-error";
}

interface ShellResponseNotFound {
    status: "not-found";
}

interface ShellResponsePermissionDenied {
    status: "permission-denied";
}

export type ShellResponse =
    | ShellResponseLoadIt
    | ShellResponseRedirect
    | ShellResponseRender
    | ShellResponseCloseModal
    | ShellResponseServerError
    | ShellResponseNetworkError
    | ShellResponseNotFound
    | ShellResponsePermissionDenied;

export async function shellGet(
    url: string,
    mode: Mode
): Promise<ShellResponse> {
    let response: Response;

    try {
        response = await fetch(url, {
            headers: { "X-Requested-With": "Shell", "X-Shell-Mode": mode },
        });
    } catch (e) {
        return {
            status: "network-error",
        };
    }

    if (response.status === 500) {
        return {
            status: "server-error",
        };
    }
    if (!response.headers.get("X-Shell-Status")) {
        // eslint-disable-next-line no-console
        console.warn(
            "Shell Warning: A non-JSON response was returned from the server. Did you forget to add the 'download' attribute to an '<a>' tag?"
        );
        return {
            status: "load-it",
        };
    }
    return response.json() as Promise<ShellResponse>;
}

export async function shellPost(
    url: string,
    data: FormData,
    mode: Mode
): Promise<ShellResponse> {
    let response: Response;

    try {
        response = await fetch(url, {
            method: "post",
            headers: { "X-Requested-With": "Shell", "X-Shell-Mode": mode },
            body: data,
        });
    } catch (e) {
        return {
            status: "network-error",
        };
    }

    if (response.status === 500) {
        return {
            status: "server-error",
        };
    }
    if (!response.headers.get("X-Shell-Status")) {
        // eslint-disable-next-line no-console
        console.warn(
            "Shell Warning: A non-JSON response was returned from the server. Did you forget to add the 'download' attribute to an '<a>' tag?"
        );
        return {
            status: "load-it",
        };
    }
    return response.json() as Promise<ShellResponse>;
}
