import React from 'react';

import { ExplorerContext, ShellProps } from '../main';
import {SearchInput} from './SearchInput';
import {Menu} from './Menu';
import { Logo } from './Logo';

interface SidebarProps extends ShellProps {
    navigate(url: string): void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> =  ({homeUrl, logoImages, explorerStartPageId, searchUrl, menuItems, user, accountUrl, logoutUrl, navigate}) => {
    const explorerWrapperRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <aside className="nav-wrapper" data-nav-primary={true}>
            <div className="inner">
                <Logo images={logoImages} homeUrl={homeUrl} navigate={navigate} />

                <SearchInput searchUrl={searchUrl} navigate={navigate} />

                <ExplorerContext.Provider value={{startPageId: explorerStartPageId, wrapperRef: explorerWrapperRef}}>
                    <Menu user={user} accountUrl={accountUrl} logoutUrl={logoutUrl} initialState={menuItems} navigate={navigate} />
                </ExplorerContext.Provider>
            </div>
            <div className="explorer__wrapper" ref={explorerWrapperRef}></div>
        </aside>
    );
};
