import React, { ReactNode } from 'react';
import { Frame } from '../navigation';

interface ContentWrapperProps {
    visible: boolean;
    frame: Frame;
    navigate(url: string): void;
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

type FrameEvent = LoadFrameEvent | NavigateFrameEvent;

const frameCallbacks: {[id: number]: (event: FrameEvent) => void} = {};

window.addEventListener('message', (event) => {
    if (event.data.id in frameCallbacks) {
        frameCallbacks[event.data.id](event.data);
    }
});

export const ContentWrapper: React.FunctionComponent<ContentWrapperProps> = ({visible, frame, onLoad, navigate}) => {
    const onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        if (e.target instanceof HTMLIFrameElement && e.target.contentWindow) {
            e.target.contentWindow.postMessage(frame, "*");

            frameCallbacks[frame.id] = (event) => {
                if (event.type == 'load') {
                    if (onLoad) {
                        onLoad(event.title);
                    }
                }

                if (event.type == 'navigate') {
                    navigate(event.url);
                }
            }
        }
    };

    return (
        <iframe onLoad={onIframeLoad} style={{
            display: visible ? 'block' : 'none',
            overflow: 'scroll',
            border: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
        }} src={'/admin/shell/frame/'} />
    );
}
