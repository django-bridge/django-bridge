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

interface MezeResponseLoadIt {
  status: "load-it";
}

interface MezeResponseRedirect {
  status: "redirect";
  path: string;
}

interface MezeResponseRender {
  status: "render";
  overlay: boolean;
  title: string;
  view: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  messages: Message[];
}

interface MezeResponseCloseOverlay {
  status: "close-overlay";
  messages: Message[];
}

interface MezeResponseServerError {
  status: "server-error";
}

interface MezeResponseNetworkError {
  status: "network-error";
}

export type MezeResponse =
  | MezeResponseLoadIt
  | MezeResponseRedirect
  | MezeResponseRender
  | MezeResponseCloseOverlay
  | MezeResponseServerError
  | MezeResponseNetworkError;

export async function mezeGet(
  url: string,
  overlay: boolean
): Promise<MezeResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "Meze" };
  if (overlay) {
    headers["X-Meze-Overlay"] = "true";
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
  if (!response.headers.get("X-Meze-Status")) {
    return {
      status: "load-it",
    };
  }
  return response.json() as Promise<MezeResponse>;
}

export async function mezePost(
  url: string,
  data: FormData,
  overlay: boolean
): Promise<MezeResponse> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "Meze" };
  if (overlay) {
    headers["X-Meze-Overlay"] = "true";
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
  if (!response.headers.get("X-Meze-Status")) {
    return {
      status: "load-it",
    };
  }
  return response.json() as Promise<MezeResponse>;
}
