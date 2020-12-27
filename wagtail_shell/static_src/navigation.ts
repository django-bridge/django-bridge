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

    nextFetchId: number = 1;
    lastReceivedFetchId: number = 1;

    currentFrame: Frame;
    nextFrame: Frame | null = null;

    navigationListeners: ((frame: Frame | null) => void)[] = [];

    constructor(mode: Mode, initialResponse: ShellResponse) {
        this.mode = mode;
        this.title = '';

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

    shellFetch = (url: string): Promise<ShellResponse | null> => {
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

    navigate = (url: string, pushState: boolean = true): Promise<void> => {
        return this.shellFetch(url).then(response => {
            if (response === null) {
                return;
            }

            if (response.status == 'load-it') {
                // TODO: Is this OK for modals?
                window.location.href = url;
            } else if (response.status == 'render') {
                this.nextFrame = {
                    id: nextFrameId++,
                    url,
                    view: response.view,
                    context: response.context,
                    pushState,
                };

                this.navigationListeners.forEach(func => func(null));
            }
        });
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
}
