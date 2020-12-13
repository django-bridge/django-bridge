import React from 'react';
import styled from 'styled-components';

import { ExplorerContext, ShellProps } from '../main';
import * as breakpoints from './common/breakpoints';
import {SearchInput} from './SearchInput';
import {Menu} from './Menu';
import { Logo } from './Logo';

const smBreakpoint = breakpoints.mediaBreakpointUp('sm');

const InnerWrapper = styled.div`
    z-index: 100;
    height: 100%;

    background: #333;  // $nav-grey-1

    ${smBreakpoint(`
        // On medium, make it possible for the nav links to scroll.
        display: flex;
        flex-flow: column nowrap;
    `)}
`;

interface SidebarProps extends ShellProps {
    navigate(url: string): void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> =  ({homeUrl, logoImages, explorerStartPageId, searchUrl, menuItems, user, accountUrl, logoutUrl, navigate}) => {
    const explorerWrapperRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <>
            <InnerWrapper>
                <Logo images={logoImages} homeUrl={homeUrl} navigate={navigate} />

                <SearchInput searchUrl={searchUrl} navigate={navigate} />

                <ExplorerContext.Provider value={{startPageId: explorerStartPageId, wrapperRef: explorerWrapperRef}}>
                    <Menu user={user} accountUrl={accountUrl} logoutUrl={logoutUrl} initialState={menuItems} navigate={navigate} />
                </ExplorerContext.Provider>
            </InnerWrapper>
            <div className="explorer__wrapper" ref={explorerWrapperRef}></div>
        </>
    );
};
