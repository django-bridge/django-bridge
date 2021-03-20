import React, { ReactNode } from 'react';
import { Mode } from '../main';
import { Frame } from '../navigation';

interface FrameWrapperProps {
    mode: Mode;
    visible: boolean;
    frame: Frame;
    style?: React.CSSProperties;
    navigate(url: string): void;
    submitForm(url: string, data: FormData): void;
    openModal?(url: string): void;
    onLoad?(title: string): void;
}

const shellViews: Map<string, (data: any, csrfToken: string) => ReactNode> = new Map();

window.registerShellView = (name: string, render: (data: any, csrfToken: string) => ReactNode) => {
    shellViews.set(name, render);
};

interface LoadFrameEvent {
    type: 'load';
    title: string;
}

interface NavigateFrameEvent {
    type: 'navigate';
    url: string;
}

interface SubmitFormFrameEvent {
    type: 'submit-form';
    action: string;
    method: 'get' | 'post';
    data: FormData;
}

interface OpenModalFrameEvent {
    type: 'open-modal';
    url: string;
}

type FrameEvent = LoadFrameEvent | NavigateFrameEvent | SubmitFormFrameEvent | OpenModalFrameEvent;

const frameCallbacks: {[id: number]: (event: FrameEvent) => void} = {};

window.addEventListener('message', (event) => {
    if (event.data.id in frameCallbacks) {
        frameCallbacks[event.data.id](event.data);
    }
});

export const FrameWrapper: React.FunctionComponent<FrameWrapperProps> = ({visible, mode, frame, style, onLoad, navigate, submitForm, openModal}) => {
    const onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        if (e.target instanceof HTMLIFrameElement && e.target.contentWindow) {
            e.target.contentWindow.postMessage({
                mode,
                frame,
            }, "*");

            frameCallbacks[frame.id] = (event) => {
                if (event.type == 'load') {
                    if (onLoad) {
                        onLoad(event.title);
                    }
                }

                if (event.type == 'navigate') {
                    navigate(event.url);
                }

                if (event.type == 'submit-form') {
                    if (event.method === 'get') {
                        // TODO: Make sure there are no files here
                        const dataString = Array.from(event.data.entries())
                            .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1] as string)}`)
                            .join('&');

                        const url = event.action + ((event.action.indexOf('?') == -1) ? '?' : '&') + dataString;
                        navigate(url);
                    } else {
                        submitForm(event.action, event.data);
                    }
                }

                if (event.type == 'open-modal') {
                    if (openModal) {
                        openModal(event.url);
                    } else {
                        // FIXME: Keep track of requests to open modals?
                    }
                }
            }
        }
    };

    const newStyle = Object.assign({}, style, {
        display: visible ? 'block' : 'none'
    })

    return (
        <iframe onLoad={onIframeLoad} style={newStyle} src={'/admin/shell/frame/'} />
    );
}
