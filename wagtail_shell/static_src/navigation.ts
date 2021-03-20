import {shellFetch, ShellResponse} from './fetch';
import { Mode } from './main';

let nextFrameId: number = 1;

export interface Frame {
    id: number;
    url: string;
    view: string;
    context: any;
    pushState: boolean;
}

export class NavigationController {
    mode: Mode;
    title: string;
    parent: NavigationController | null;

    nextFetchId: number = 1;
    lastReceivedFetchId: number = 1;

    currentFrame: Frame;
    nextFrame: Frame | null = null;

    navigationListeners: ((frame: Frame | null) => void)[] = [];

    constructor(mode: Mode, initialResponse: ShellResponse, parent: NavigationController | null) {
        this.mode = mode;
        this.title = '';
        this.parent = parent;

        if (initialResponse.status == 'render') {
            this.currentFrame = {
                id: nextFrameId++,
                url: window.location.pathname,
                view: initialResponse.view,
                context: initialResponse.context,
                pushState: false,
            };
        }
    }

    _shellFetch = (url: string): Promise<ShellResponse | null> => {
        // Get a fetch ID
        // We do this so that if responses come back in a different order to
        // when the requests were sent, the older requests don't replace newer ones
        let thisFetchId = this.nextFetchId++;

        return shellFetch(url, this.mode).then(response => {
            if (thisFetchId < this.lastReceivedFetchId) {
                // A subsequent fetch was made but its response came in before this one
                // So ignore this response
                return null;
            }

            this.lastReceivedFetchId = thisFetchId;

            return response;
        });
    }

    _handleResponse = (response: ShellResponse, url: string, pushState: boolean = true) => {
        if (response.status == 'load-it') {
            if (this.mode === 'browser') {
                window.location.href = url;
            } else if (this.mode == 'modal' && this.parent) {
                // load-it responses require reloading the entire page.
                // Escalate this response to the page's navigation controller instead
                this.parent.escalate(url, response);
            } else {
                console.error("Unable to handle a 'load-it' response here.")
            }
        } else if (response.status == 'render') {
            // If this navigation controller is handling a modal, make sure the response can be
            // loaded in a modal. Otherwise, escalate it
            if (this.mode == 'modal' && response.mode != 'modal') {
                if (this.parent) {
                    this.parent.escalate(url, response);
                    return;
                } else {
                    console.warn("Response does not support rendering in a modal, but no method of escalation was given.")
                }
            }

            this.nextFrame = {
                id: nextFrameId++,
                url,
                view: response.view,
                context: response.context,
                pushState,
            };

            this.navigationListeners.forEach(func => func(null));
        }
    }

    navigate = (url: string, pushState: boolean = true): Promise<void> => {
        return this._shellFetch(url).then(response => {
            if (response === null) {
                return;
            }

            this._handleResponse(response, url, pushState);
        });
    }

    escalate = (url: string, response: ShellResponse) => {
        // Called by a child NavigationController when it cannot handle a response.
        // For example, say this NavigationController controls the main window and there's a
        // modal open that has a different NavigationController. If the user clicks a link
        // that needs to navigate the whole page somewhere else, that response is escalated
        // from the modal NavigationController to the main window NavigationController using
        // this method.
        this._handleResponse(response, url);
    }

    onLoadNextFrame = (title: string) => {
        if (this.nextFrame) {
            this.currentFrame = this.nextFrame;
            this.nextFrame = null;
            this.title = title;

            if (this.mode == 'browser') {
                document.title = title;

                if (this.currentFrame.pushState) {
                    history.pushState({}, "", this.currentFrame.url);
                }
            }

            this.navigationListeners.forEach(func => func(this.currentFrame));
        }
    }

    addNavigationListener = (func: (frame: Frame | null) => void) => {
        this.navigationListeners.push(func);
    }

    removeNavigationListener = (func: (frame: Frame | null) => void) => {
        this.navigationListeners = this.navigationListeners.filter((listener) => listener !== func);
    }
}
