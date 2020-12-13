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

export const ContentWrapper: React.FunctionComponent<ContentWrapperProps> = ({visible, frame, navigate, onLoad}) => {
    if (frame.view === 'iframe') {
        const onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
            if (e.target instanceof HTMLIFrameElement && e.target.contentDocument) {
                // Insert a <base target="_parent"> tag into the <head> of the iframe
                // This makes it open all links in the main window
                const baseElement = e.target.contentDocument.createElement('base');
                baseElement.target = '_parent';
                e.target.contentDocument.head.appendChild(baseElement);

                // Ajaxify links
                Array.from(e.target.contentDocument.links).forEach(link => {
                    // Don't ajaxify download links
                    if (link.hasAttribute('download')) {
                        return
                    }

                    // Get href
                    const href = link.getAttribute('href');
                    if (!href || href.startsWith('#')) {
                        return;
                    }

                    link.addEventListener('click', (e: MouseEvent) => {
                        e.preventDefault();

                        if (href.startsWith('?')) {
                            navigate(document.location.pathname + href);
                        } else {
                            navigate(href);
                        }
                    });
                });

                // Ajaxify 'get' forms
                Array.from(e.target.contentDocument.forms).forEach(form => {
                    // Don't ajaxify POST forms
                    if (form.method.toLowerCase() == 'post') {
                        return;
                    }

                    // Make sure action is set to something.
                    // If it's blank, the browser will try to post the data to 'about:srcdoc' which will result in an error.
                    // Note: Don't use form.action here as some forms have an action field!
                    const formAction = form.getAttribute('action');
                    form.action = formAction || frame.url;
                });

                if (onLoad) {
                    onLoad(e.target.contentDocument.title);
                }
            }
        };

        // Put the URL into an <a> tag appends netloc/scheme to URL, if needed
        const urlAnchor = document.createElement('a');
        urlAnchor.href = frame.url;

        // Append `wagtailshell_iframe=true` GET parameter to it
        // This makes the shell return a clean response without a menu
        const url = new URL(urlAnchor.href);
        url.searchParams.set('wagtailshell_iframe', 'true');

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
            }} src={url.toString()} />
        );
    } else if (shellViews.has(frame.view)) {
        const viewFunc = shellViews.get(frame.view);
        if (onLoad) {
            onLoad('React app!');
        }
        if (viewFunc) {
            return <main className="content-wrapper"><div className="wrapper">{viewFunc(frame.context, window.csrfToken)}</div></main>;
        } else {
            return <main className="content-wrapper"><div className="wrapper"><p>Unable to render content</p></div></main>;
        }
    } else {
        if (onLoad) {
            onLoad('Unable to render content');
        }
        return (
            <main className="content-wrapper"><div className="wrapper"><p>Unable to render content</p></div></main>
        );
    }
}
