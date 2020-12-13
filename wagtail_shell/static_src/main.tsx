import React, { MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import {LogoImages} from './components/Logo';
import {Browser} from './components/Browser';
import {Sidebar} from './components/Sidebar';
import * as breakpoints from './components/common/breakpoints';

import {NavigationController} from './navigation';

const smBreakpoint = breakpoints.mediaBreakpointUp('sm');

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

const SidebarWrapper = styled.aside`
    position: relative;
    margin-left: -200px;  // $menu-width;
    width: 200px;  // $menu-width;
    float: left;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #333;  // $nav-grey-1;
    z-index: 2;

    ${smBreakpoint(css`
        // height and position necessary to force it to 100% height of screen (with some JS help)
        position: absolute;
        left: 0;
        height: 100%;
        margin-left: 0;

        // Allows overspill of messages banner onto left menu, but also explorer
        // to spill over main content
        z-index: auto;
    `)}
`;

const BrowserWrapper = styled.div`
    ${smBreakpoint(css`
        position: absolute;
        width: calc(100% - 200px);  // 200px = $menu-width;
        height: 100%
    `)}
`;

const Shell: React.FunctionComponent<ShellProps> = (props) => {
    return (
        <>
            <SidebarWrapper>
                <Sidebar {...props} navigate={props.navigationController.navigate} />
            </SidebarWrapper>
            <BrowserWrapper>
                <Browser navigationController={props.navigationController} />
            </BrowserWrapper>
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
