/* eslint-disable @typescript-eslint/no-explicit-any */

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
  overlay: boolean;
  title: string;
  view: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  messages: Message[];
}

interface DjreamResponseCloseOverlay {
  status: "close-overlay";
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
  | DjreamResponseCloseOverlay
  | DjreamResponseServerError
  | DjreamResponseNetworkError;

export async function djreamGet(
  url: string,
  overlay: boolean
): Promise<DjreamResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "Djream" };
  if (overlay) {
    headers["X-Djream-Overlay"] = "true";
  }

  try {
    response = await fetch(url, { headers });
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
  overlay: boolean
): Promise<DjreamResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "Djream" };
  if (overlay) {
    headers["X-Djream-Overlay"] = "true";
  }

  try {
    response = await fetch(url, {
      method: "post",
      headers,
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
