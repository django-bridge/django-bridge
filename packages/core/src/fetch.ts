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

interface ReloadResponse {
  status: "reload";
}

interface RedirectResponse {
  status: "redirect";
  path: string;
}

interface RenderResponse {
  status: "render";
  overlay: boolean;
  title: string;
  view: string;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  messages: Message[];
}

interface CloseOverlayResponse {
  status: "close-overlay";
  messages: Message[];
}

interface ServerErrorResponse {
  status: "server-error";
}

interface NetworkErrorResponse {
  status: "network-error";
}

export type Response =
  | ReloadResponse
  | RedirectResponse
  | RenderResponse
  | CloseOverlayResponse
  | ServerErrorResponse
  | NetworkErrorResponse;

export async function djangorenderGet(
  url: string,
  overlay: boolean
): Promise<Response> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "DjangoRender" };
  if (overlay) {
    headers["X-DjangoRender-Overlay"] = "true";
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
  if (!response.headers.get("X-DjangoRender-Status")) {
    return {
      status: "reload",
    };
  }
  return response.json() as Promise<Response>;
}

export async function djangorenderPost(
  url: string,
  data: FormData,
  overlay: boolean
): Promise<Response> {
  let response: Response;

  const headers: HeadersInit = { "X-Requested-With": "DjangoRender" };
  if (overlay) {
    headers["X-DjangoRender-Overlay"] = "true";
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
  if (!response.headers.get("X-DjangoRender-Status")) {
    return {
      status: "reload",
    };
  }
  return response.json() as Promise<Response>;
}
