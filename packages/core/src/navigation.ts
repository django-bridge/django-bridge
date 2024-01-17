/* eslint-disable @typescript-eslint/no-explicit-any */

import { Message, Mode, djreamGet, djreamPost, DjreamResponse } from "./fetch";

let nextFrameId = 1;

export interface Frame<Props = Record<string, unknown>> {
  id: number;
  path: string;
  title: string;
  view: string;
  props: Props;
  context: Record<string, unknown>;
  serverMessages: Message[];
  pushState: boolean;
  shouldReloadCallback?: (newPath: string, newProps: Props) => boolean;
}

interface HistoryState {
  prevPath?: string;
  prevScrollPosition?: number;
}

export class NavigationController {
  mode: Mode;

  parent: NavigationController | null;

  unpack: (data: Record<string, unknown>) => Record<string, unknown>;

  nextFetchId = 1;

  lastReceivedFetchId = 1;

  currentFrame: Frame;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigationListeners: ((frame: Frame | null, newFrame: boolean) => void)[] =
    [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serverErrorListeners: ((kind: "server" | "network") => void)[] = [];

  closeListeners: (() => void)[] = [];

  constructor(
    mode: Mode,
    parent: NavigationController | null,
    unpack: (data: Record<string, unknown>) => Record<string, unknown>
  ) {
    this.mode = mode;
    this.parent = parent;
    this.unpack = unpack;

    nextFrameId += 1;
    this.currentFrame = {
      id: nextFrameId,
      path: window.location.pathname,
      title: "Loading",
      view: "loading",
      props: {},
      context: {},
      serverMessages: [],
      pushState: false,
    };
  }

  private fetch = async (
    fetcher: () => Promise<DjreamResponse>,
    url: string,
    pushState: boolean,
    neverReload = false
  ) => {
    // Get a fetch ID
    // We do this so that if responses come back in a different order to
    // when the requests were sent, the older requests don't replace newer ones
    this.nextFetchId += 1;
    const thisFetchId = this.nextFetchId;

    const response = await fetcher();

    if (thisFetchId < this.lastReceivedFetchId) {
      // A subsequent fetch was made but its response came in before this one
      // So ignore this response
      return;
    }

    this.lastReceivedFetchId = thisFetchId;

    if (response === null) {
      return;
    }

    await this.handleResponse(response, url, pushState, neverReload);
  };

  handleResponse = (
    response: DjreamResponse,
    path: string,
    pushState = true,
    neverReload = false
  ): Promise<void> => {
    if (response.status === "load-it") {
      if (this.mode === "browser") {
        window.location.href = path;
      } else if (this.mode === "modal" && this.parent) {
        // load-it responses require reloading the entire page.
        // Escalate this response to the page's navigation controller instead
        return this.parent.escalate(path, response);
      } else {
        // eslint-disable-next-line no-console
        console.error("Unable to handle a 'load-it' response here.");
      }
    } else if (response.status === "redirect") {
      return this.navigate(response.path);
    } else if (response.status === "render") {
      // If this navigation controller is handling a modal, make sure the response can be
      // loaded in a modal. Otherwise, escalate it
      if (this.mode === "modal" && response.mode !== "modal") {
        if (this.parent) {
          return this.parent.escalate(path, response);
        }
        // eslint-disable-next-line no-console
        console.warn(
          "Response does not support rendering in a modal, but no method of escalation was given."
        );
      }

      // Unpack props and context
      const props = this.unpack(response.props);
      const context = this.unpack(response.context);

      // If the view is the same as the current frame, check if the frame has a shouldReloadCallback registered.
      // If it does, call it to see if we should reload the view or just update its props
      let reload = !neverReload;
      if (
        reload &&
        response.view === this.currentFrame.view &&
        this.currentFrame.shouldReloadCallback
      ) {
        reload = this.currentFrame.shouldReloadCallback(path, props);
      }

      this.pushFrame(
        path,
        response.title,
        response.view,
        props,
        context,
        response.messages,
        pushState,
        reload
      );
    } else if (response.status === "close-modal") {
      // Call close listeners. One of these should close the modal
      this.closeListeners.forEach((func) => func());

      // Push any messages
      response.messages.forEach((message) => {
        this.currentFrame.serverMessages.push(message);
      });
    } else if (response.status === "server-error") {
      this.serverErrorListeners.forEach((func) => func("server"));
      return Promise.reject();
    } else if (response.status === "network-error") {
      this.serverErrorListeners.forEach((func) => func("network"));
      return Promise.reject();
    }

    return Promise.resolve();
  };

  navigate = (url: string, pushState = true): Promise<void> => {
    let path = url;

    if (!url.startsWith("/")) {
      const urlObj = new URL(url);

      if (urlObj.origin !== window.location.origin) {
        window.location.href = url;
        return Promise.resolve();
      }

      path = urlObj.pathname + urlObj.search;
    }

    return this.fetch(() => djreamGet(path, this.mode), path, pushState);
  };

  pushFrame = (
    path: string,
    title: string,
    view: string,
    props: Record<string, unknown>,
    context: Record<string, unknown>,
    serverMessages: Message[],
    pushState = true,
    reload = true
  ) => {
    let frameId = this.currentFrame.id;

    const newFrame = view !== this.currentFrame.view || reload;
    if (newFrame) {
      nextFrameId += 1;
      frameId = nextFrameId;
    }

    this.currentFrame = {
      id: frameId,
      path,
      title,
      view,
      props,
      context,
      serverMessages,
      pushState,
    };

    if (this.mode === "browser") {
      document.title = title;

      if (this.currentFrame.pushState) {
        let scollPositionY = 0;
        const scrollPosition = window.scrollY;
        const historyState = window.history?.state as HistoryState;
        // if we're going back to previous path, return to the the previous scroll position
        if (historyState?.prevPath === this.currentFrame.path) {
          scollPositionY = historyState.prevScrollPosition ?? 0;
        }

        // set the previous path and scroll position in the state before pushing the new url
        window.history.pushState(
          {
            prevPath: window.location.pathname,
            prevScrollPosition: scrollPosition,
          },
          "",
          this.currentFrame.path
        );

        // set the scroll position
        window.scrollTo(0, scollPositionY);
      }
    }

    this.navigationListeners.forEach((func) =>
      func(this.currentFrame, newFrame)
    );
  };

  replacePath = (frameId: number, path: string) => {
    if (frameId === this.currentFrame.id) {
      // replace-path called on current frame
      // Change the path using replaceState
      this.currentFrame.path = path;

      if (this.mode === "browser") {
        // eslint-disable-next-line no-restricted-globals
        history.replaceState({}, "", this.currentFrame.path);
      }
    }
  };

  submitForm = (url: string, data: FormData): Promise<void> =>
    this.fetch(() => djreamPost(url, data, this.mode), url, true);

  refreshProps = (): Promise<void> => {
    const url =
      window.location.pathname + window.location.search + window.location.hash;

    return this.fetch(() => djreamGet(url, this.mode), url, false, true);
  };

  // Called by a child NavigationController when it cannot handle a response.
  // For example, say this NavigationController controls the main window and there's a
  // modal open that has a different NavigationController. If the user clicks a link
  // that needs to navigate the whole page somewhere else, that response is escalated
  // from the modal NavigationController to the main window NavigationController using
  // this method.
  private escalate = (url: string, response: DjreamResponse): Promise<void> =>
    this.handleResponse(response, url);

  addNavigationListener = (
    func: (frame: Frame | null, newFrame: boolean) => void
  ) => {
    this.navigationListeners.push(func);
  };

  removeNavigationListener = (
    func: (frame: Frame | null, newFrame: boolean) => void
  ) => {
    this.navigationListeners = this.navigationListeners.filter(
      (listener) => listener !== func
    );
  };

  addServerErrorListener = (func: (kind: "server" | "network") => void) => {
    this.serverErrorListeners.push(func);
  };

  removeServerErrorListener = (func: (kind: "server" | "network") => void) => {
    this.serverErrorListeners = this.serverErrorListeners.filter(
      (listener) => listener !== func
    );
  };

  addCloseListener = (func: () => void) => {
    this.closeListeners.push(func);
  };

  removeCloseListener = (func: () => void) => {
    this.closeListeners = this.closeListeners.filter(
      (listener) => listener !== func
    );
  };
}
