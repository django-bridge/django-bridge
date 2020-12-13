import React, { MutableRefObject } from 'react';
import ReactDOM from 'react-dom';

import {LogoImages} from './components/Logo';
import {Browser} from './components/Browser';
import {Sidebar} from './components/Sidebar';

import {NavigationController} from './navigation';

// A React context to pass some data down to the ExplorerMenuItem component
interface ExplorerContext {
    startPageId: number | null;
    wrapperRef: MutableRefObject<HTMLDivElement | null> | null;
}
export const ExplorerContext = React.createContext<ExplorerContext>({startPageId: null, wrapperRef: null});

export interface ShellProps {
    homeUrl: string;
    logoImages: LogoImages
    explorerStartPageId: number | null;
    searchUrl: string;
    menuItems: any;
    user: {
        name: string;
        avatarUrl: string;
    };
    accountUrl: string;
    logoutUrl: string;
    navigationController: NavigationController
}

const Shell: React.FunctionComponent<ShellProps> = (props) => {
    return (
        <>
            <aside className="nav-wrapper" data-nav-primary={true}>
                <Sidebar {...props} navigate={props.navigationController.navigate} />
            </aside>
            <Browser navigationController={props.navigationController} />
        </>
    );
}

export function initShell() {
    const shellElement = document.getElementById('wagtailshell-root');
    const sidebarElement = document.getElementById('wagtailshell-sidebar');

    if (shellElement instanceof HTMLElement && sidebarElement instanceof HTMLElement && sidebarElement.dataset.props) {
        if (shellElement.dataset.initialResponse) {
            const navController = new NavigationController(JSON.parse(shellElement.dataset.initialResponse));

            // Add listener for popState
            // This event is fired when the user hits the back/forward links in their browser
            window.addEventListener('popstate', () => {
                navController.navigate(document.location.pathname, false);
            });

            const props = JSON.parse(sidebarElement.dataset.props);

            const renderShell = () => {
                ReactDOM.render(
                    <Shell {...props} navigationController={navController} />,
                    shellElement
                );
            };

            renderShell();
            navController.addNavigationListener(renderShell);
        } else {
            // Legacy mode
            const navigate = (url: string) => {
                window.location.href = url;
            };

            ReactDOM.render(
                <Sidebar {...JSON.parse(sidebarElement.dataset.props)} navigate={navigate} />,
                sidebarElement
            );
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initShell();
});
