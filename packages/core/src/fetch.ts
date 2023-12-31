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

interface DjreamResponseLoadIt {
  status: "load-it";
}

interface DjreamResponseRedirect {
  status: "redirect";
  path: string;
}

interface DjreamResponseRender {
  status: "render";
  mode: Mode;
  title: string;
  view: string;
  context: any;
  messages: Message[];
}

interface DjreamResponseCloseModal {
  status: "close-modal";
  messages: Message[];
}

interface DjreamResponseServerError {
  status: "server-error";
}

interface DjreamResponseNetworkError {
  status: "network-error";
}

export type DjreamResponse =
  | DjreamResponseLoadIt
  | DjreamResponseRedirect
  | DjreamResponseRender
  | DjreamResponseCloseModal
  | DjreamResponseServerError
  | DjreamResponseNetworkError;

export async function djreamGet(
  url: string,
  mode: Mode
): Promise<DjreamResponse> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { "X-Requested-With": "Djream", "X-Djream-Mode": mode },
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
  if (!response.headers.get("X-Djream-Status")) {
    return {
      status: "load-it",
    };
  }
  return response.json() as Promise<DjreamResponse>;
}

export async function djreamPost(
  url: string,
  data: FormData,
  mode: Mode
): Promise<DjreamResponse> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "post",
      headers: { "X-Requested-With": "Djream", "X-Djream-Mode": mode },
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
  if (!response.headers.get("X-Djream-Status")) {
    return {
      status: "load-it",
    };
  }
  return response.json() as Promise<DjreamResponse>;
}
