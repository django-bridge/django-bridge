import {shellFetch, ShellResponse} from './fetch';

export interface Frame {
    id: number;
    url: string;
    view: string;
    context: any;
}

export class NavigationController {
    nextFetchId: number = 1;
    lastReceivedFetchId: number = 1;

    nextFrameId: number = 1;
    currentFrame: Frame;
    nextFrame: Frame | null = null;

    navigationListeners: (() => void)[] = [];

    constructor(initialResponse: ShellResponse) {
        if (initialResponse.status == 'render') {
            this.currentFrame = {
                id: this.nextFrameId++,
                url: window.location.pathname,
                view: initialResponse.view,
                context: initialResponse.context,
            };
        }
    }

    shellFetch = (url: string): Promise<ShellResponse | null> => {
        // Get a fetch ID
        // We do this so that if responses come back in a different order to
        // when the requests were sent, the older requests don't replace newer ones
        let thisFetchId = this.nextFetchId++;

        return shellFetch(url).then(response => {
            if (thisFetchId < this.lastReceivedFetchId) {
                // A subsequent fetch was made but its response came in before this one
                // So ignore this response
                return null;
            }

            this.lastReceivedFetchId = thisFetchId;

            return response;
        });
    }

    navigate = (url: string, pushState: boolean = true) => {
        this.shellFetch(url).then(response => {
            if (response === null) {
                return;
            }

            if (response.status == 'load-it') {
                window.location.href = url;
            } else if (response.status == 'render') {
                if (pushState) {
                    history.pushState({}, "", url);
                }

                this.nextFrame = {
                    id: this.nextFrameId++,
                    url,
                    view: response.view,
                    context: response.context,
                };

                this.navigationListeners.forEach(func => func());
            }
        });
    }

    onLoadNextFrame = () => {
        if (this.nextFrame) {
            this.currentFrame = this.nextFrame;
            this.nextFrame = null;

            this.navigationListeners.forEach(func => func());
        }
    }

    addNavigationListener = (func: () => void) => {
        this.navigationListeners.push(func);
    }
}
