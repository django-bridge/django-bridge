import React, { MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import {LogoImages} from './components/Logo';
import {Browser} from './components/Browser';
import ModalWindow from './components/ModalWindow';

import {Sidebar} from './components/Sidebar';
import * as mixins from './components/common/mixins';
import './wagtailscss/styles.scss';

import {Frame, NavigationController} from './navigation';

export type Mode = 'browser' | 'modal';

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

interface WrapperProps {
    collapsed: boolean;
}

const ShellWrapper = styled.div<WrapperProps>`
    height: 100vh;
    padding-left: 200px;  // menu-width
    ${mixins.transition('padding-left 0.3s ease')}

    ${(props) => props.collapsed && css`
    padding-left: 50px;
    `}
`;

const SidebarWrapper = styled.aside<WrapperProps>`
    position: fixed;
    left: 0;
    width: 200px;  // $menu-width;
    float: left;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #333;  // $nav-grey-1;
    z-index: 1;

    ${mixins.transition('width 0.3s ease')}

    ${(props) => props.collapsed && css`
        width: 50px;
    `}
`;

const BrowserWrapper = styled.div<WrapperProps>`
    position: absolute;
    width: 100%;
    height: 100%;
    width: calc(100% - 200px);  // 200px = $menu-width;

    ${mixins.transition('width 0.3s ease')}

    ${(props) => props.collapsed && css`
        width: calc(100% - 50px);
    `}
`;

const usePersistedState = <T, _>(key: string, defaultValue: T): [T, (value: T) => void]  => {
    const value = localStorage.getItem(key);
    const [state, setState] = React.useState(
        value ? JSON.parse(value) : defaultValue
    );
    React.useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

const Shell: React.FunctionComponent<ShellProps> = (props) => {
    const [collapsed, setCollapsed] = usePersistedState('wagtailshell-collapsed', window.innerWidth < 800);
    const [modalStack, setModalStack] = React.useState<NavigationController[]>([]);
    const [render, setRender] = React.useState(0);

    const openModal = (parentModalId: number | null, url: string) => {
        // Only the top modal can launch new modals
        if (parentModalId === null && modalStack.length > 0) {
            // Browser window tried to create a modal but there is already a modal
            return;
        } else if (parentModalId !== null && parentModalId != modalStack.length - 1) {
            // An existing modal tried to create a child, but it already has one going
            return;
        }

        // Set up a new navigation controller
        const navigationController = new NavigationController('modal', {
            status: 'render',
            mode: 'modal',
            view: 'modal-loading',
            context: {},
        }, props.navigationController);
        navigationController.addNavigationListener(() => {
            // HACK: Update some state to force a re-render
            setRender(render + Math.random());
        });
        navigationController.navigate(url);

        // Push it to the stack
        const newModalStack = modalStack.slice();
        newModalStack.push(navigationController);
        setModalStack(newModalStack);
    };

    const closeTopModal = () => {
        const newModalStack = modalStack.slice();
        newModalStack.pop();
        setModalStack(newModalStack);
    };

    const expandModal = (modalId: number) => {
        // Navigate to the modal's URL
        props.navigationController.navigate(modalStack[modalId].currentFrame.url);
        setModalStack([]);
    };

    React.useEffect(() => {
        const keydownEventListener = (e: KeyboardEvent) => {
            // Close top modal on click escape
            if (e.key === 'Escape') {
                closeTopModal();
            }
        };

        document.addEventListener('keydown', keydownEventListener);

        return () => {
            document.removeEventListener('keydown', keydownEventListener);
        };
    });

    // Close all models when we navigate the main window
    props.navigationController.addNavigationListener(() => {
        setModalStack([]);
    });

    return (
        <ShellWrapper collapsed={collapsed}>
            {modalStack.map((navigationController, index) => {
                const isLoading = navigationController.nextFrame !== null;

                if (isLoading) {
                    return (
                        <ModalWindow key={index} heading={navigationController.title} isLoading={true} onClose={() => closeTopModal()} onExpand={() => expandModal(index)}>
                            <Browser navigationController={navigationController} openModal={(url) => openModal(index, url)} />
                        </ModalWindow>
                    );
                } else {
                    return (
                        <ModalWindow key={index} heading={navigationController.title} isLoading={false} onClose={() => closeTopModal()} onExpand={() => expandModal(index)}>
                            <Browser navigationController={navigationController} openModal={(url) => openModal(index, url)} />
                        </ModalWindow>
                    );
                }
            })}
            <SidebarWrapper collapsed={collapsed} className={collapsed ? 'sidebar-collapsed' : ''}>
                <Sidebar {...props} collapsed={collapsed} navigationController={props.navigationController} onCollapse={setCollapsed} />
            </SidebarWrapper>
            <BrowserWrapper collapsed={collapsed} className={collapsed ? 'sidebar-collapsed' : ''}>
                <Browser navigationController={props.navigationController} openModal={(url) => openModal(null, url)} />
            </BrowserWrapper>
        </ShellWrapper>
    );
}

export function initShell() {
    const shellElement = document.getElementById('wagtailshell-root');
    const sidebarElement = document.getElementById('wagtailshell-sidebar');

    if (shellElement instanceof HTMLElement && sidebarElement instanceof HTMLElement && sidebarElement.dataset.props && shellElement.dataset.initialResponse) {
        const navController = new NavigationController('browser', JSON.parse(shellElement.dataset.initialResponse), null);

        // Add listener for popState
        // This event is fired when the user hits the back/forward links in their browser
        window.addEventListener('popstate', () => {
            navController.navigate(document.location.pathname, false);
        });

        const props = JSON.parse(sidebarElement.dataset.props);

        const renderShell = (_frame: Frame | null, firstRender?: boolean) => {
            ReactDOM.render(
                <Shell {...props} navigationController={navController} />,
                shellElement,
                () => {
                    if (firstRender) {
                        document.body.classList.add('ready');
                    }
                }
            );
        };

        renderShell(null, true);
        navController.addNavigationListener(renderShell);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initShell();
});
