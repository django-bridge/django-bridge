import React from 'react';
import styled, { css } from 'styled-components';

import { ExplorerContext, ShellProps } from '../main';
import * as breakpoints from './common/breakpoints';
import {SearchInput} from './SearchInput';
import {Menu} from './Menu';
import { Logo } from './Logo';
import { NavigationController } from '../navigation';

const smBreakpoint = breakpoints.mediaBreakpointUp('sm');

const InnerWrapper = styled.div`
    height: 100%;

    background: #333;  // $nav-grey-1

    ${smBreakpoint(css`
        // On medium, make it possible for the nav links to scroll.
        display: flex;
        flex-flow: column nowrap;
    `)}
`;

interface SidebarProps extends ShellProps {
    navigationController: NavigationController;
}

export const Sidebar: React.FunctionComponent<SidebarProps> =  ({homeUrl, logoImages, explorerStartPageId, searchUrl, menuItems, user, accountUrl, logoutUrl, navigationController}) => {
    const explorerWrapperRef = React.useRef<HTMLDivElement | null>(null);

    // Track the active URL so that we can change the highlighted menu item as the user browses
    const [activeUrl, setActiveUrl] = React.useState(window.location.pathname);
    React.useEffect(() => {
        navigationController.addNavigationListener((frame) => {
            // Called whenever a frame starts loading or completes loading
            // When the frame starts loading, frame = null, otherwise frame is set
            // I know this is a bit messy.
            // TODO make this better
            if (frame) {
                setActiveUrl(frame.url);
            }
        });
    }, []);

    return (
        <>
            <InnerWrapper>
                <Logo images={logoImages} homeUrl={homeUrl} navigate={navigationController.navigate} />

                <SearchInput searchUrl={searchUrl} navigate={navigationController.navigate} />

                <ExplorerContext.Provider value={{startPageId: explorerStartPageId, wrapperRef: explorerWrapperRef}}>
                    <Menu activeUrl={activeUrl} user={user} accountUrl={accountUrl} logoutUrl={logoutUrl} menuItems={menuItems} navigate={navigationController.navigate} />
                </ExplorerContext.Provider>
            </InnerWrapper>
            <div className="explorer__wrapper" ref={explorerWrapperRef}></div>
        </>
    );
};
