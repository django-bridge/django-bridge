import React from 'react';
import styled, { css } from 'styled-components';

import Button from './common/Button';
import Icon from './common/Icon';
import * as mixins from './common/mixins';
import * as breakpoints from './common/breakpoints';
import { ExplorerContext, ShellProps } from '../main';

const smBreakpoint = breakpoints.mediaBreakpointUp('sm');

interface MenuItemCommon {
    name: string;
    url: string;
    classnames: string;
    icon_name: string;
    attr_string: string;
    label: string;
    active: boolean;
    open?: boolean;
}

interface MenuItem {
    type: 'item',
    data: MenuItemCommon;
}

interface MenuGroup {
    type: 'group',
    data: MenuItemCommon;
    items: MenuData;
}

type MenuData = (MenuItem | MenuGroup)[];

interface MenuItemProps {
    data: MenuItemCommon;
    dispatch(action: MenuAction): void;
    navigate(url: string): void;
}

const ExplorerMenuItem: React.FunctionComponent<MenuItemProps> = ({data, dispatch}) => {
    const explorerToggle = React.useRef<((page: number) => void) | null>(null);

    const classNames = ['menu-item'];

    if (data.active) {
        classNames.push('menu-active');
    }

    const context = React.useContext(ExplorerContext);
    /* TODO
    React.useEffect(() => {
        if (context?.wrapperRef?.current) {
            explorerToggle.current = initExplorer(context.wrapperRef.current, navigate);
        }
    }, [context, context?.wrapperRef]);
    */

    const onClickExplorer = (e: React.MouseEvent) => {
        e.preventDefault();

        // Set active menu item
        dispatch({
            type: 'set-active-menu-item',
            name: data.name,
        });

        if (explorerToggle.current) {
            explorerToggle.current(context.startPageId || 1);
        }
    }

    return (
        <li className={classNames.join(' ')}>
              <Button
                dialogTrigger={true}
                onClick={onClickExplorer}
            >
                <Icon name="folder-open-inverse" className="icon--menuitem" />
                    {data.label}
                <Icon name="arrow-right" className="icon--submenu-trigger" />
            </Button>
        </li>
    );
}

const MenuItem: React.FunctionComponent<MenuItemProps> = ({data, dispatch, navigate}) => {
    const classNames = ['menu-item'];

    if (data.active) {
        classNames.push('menu-active');
    }

    // Special case: Page explorer
    if (data.name === 'explorer') {
        return <ExplorerMenuItem data={data} dispatch={dispatch} navigate={navigate} />
    }

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Set active menu item
        dispatch({
            type: 'set-active-menu-item',
            name: data.name,
        });

        navigate(data.url);
    }

    return (
        <li className={classNames.join(' ')}>
            <a href="#"
               onClick={onClick}
               className={data.classnames}>
                {data.icon_name && <Icon name={data.icon_name} className="icon--menuitem"/>}
                {data.label}
            </a>
        </li>

    );
}

interface MenuGroupProps {
    data: MenuItemCommon;
    items: MenuData;
    dispatch(action: MenuAction): void;
    navigate(url: string): void;
}

const MenuGroup: React.FunctionComponent<MenuGroupProps> = ({data, items, dispatch, navigate}) => {
    const classNames = ['menu-item', 'submenu'];

    if (data.active) {
        classNames.push('menu-active');
    }

    if (data.open) {
        classNames.push('submenu-open');
    }

    // const activeClass = 'submenu-active';
    const submenuContainerRef = React.useRef<HTMLLIElement | null>(null);
    React.useEffect(() => {
        // Close submenu when user clicks outside of it
        // FIXME: Doesn't actually work because outside click events are usually in an iframe.
        const onMousedown = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement && submenuContainerRef.current && !submenuContainerRef.current.contains(e.target)) {
                //dispatch({
                //    type: 'close-submenu',
                //});
            }
        };

        // Close submenu when user presses escape
        const onKeydown = (e: KeyboardEvent) => {
            // IE11 uses "Esc" instead of "Escape"
            if (e.key === 'Escape' || e.key === 'Esc') {
                dispatch({
                    type: 'close-submenu',
                });
            }
        };

        document.addEventListener('mousedown', onMousedown);
        document.addEventListener('keydown', onKeydown);

        return () => {
            document.removeEventListener('mousedown', onMousedown);
            document.removeEventListener('keydown', onKeydown);
        };
    }, [submenuContainerRef]);

    const onClick = (e: React.MouseEvent) => {
        if (data.open) {
            dispatch({
                type: 'close-submenu',
            });
        } else {
            dispatch({
                type: 'open-submenu',
                name: data.name,
            });
        }

        e.preventDefault();
    };

    return (
        <li className={classNames.join(' ')} ref={submenuContainerRef}>
            <a href="#" onClick={onClick} className={data.classnames}>
                {data.icon_name && <Icon name={data.icon_name} className="icon--menuitem"/>}
                {data.label}
                <Icon name="arrow-right" className="icon--submenu-trigger"/>
            </a>
            <div className="nav-submenu">
                <h2 id={`nav-submenu-${data.name}-title`} className={data.classnames}>
                    {data.icon_name && <Icon name={data.icon_name} className="icon--submenu-header"/>}
                    {data.label}
                </h2>
                <ul className="nav-submenu__list" aria-labelledby="nav-submenu-{{ name }}-title">
                    {renderMenuItems(items, dispatch, navigate)}
                </ul>
            </div>
        </li>
    );
}

function renderMenuItems(menuItems: MenuData, dispatch: (action: MenuAction) => void, navigate: (url: string) => void) {
    return (
        <>
            {menuItems.map(menuItem => {
                switch (menuItem.type) {
                    case 'group':
                        return <MenuGroup key={menuItem.data.name} data={menuItem.data} dispatch={dispatch} items={menuItem.items} navigate={navigate} />;
                    case 'item':
                        return <MenuItem key={menuItem.data.name} data={menuItem.data} dispatch={dispatch} navigate={navigate} />;
                }
            })}
        </>
    )
}

interface SetActiveMenuItemAction {
    type: 'set-active-menu-item',
    name: string,
}

interface OpenSubmenuAction {
    type: 'open-submenu',
    name: string,
}

interface CloseSubmenuAction {
    type: 'close-submenu',
}

type MenuAction = SetActiveMenuItemAction | OpenSubmenuAction | CloseSubmenuAction;

function menuReducer(state: MenuData, action: MenuAction) {
    let newState = state.slice();

    if (action.type === 'set-active-menu-item') {
        const findAndActivateMenuItem: (menuItems: MenuData) => boolean = (menuItems) => {
            let containsActiveMenuItem = false;

            menuItems.forEach(menuItem => {
                menuItem.data.active = action.name == menuItem.data.name;
                menuItem.data.open = false;

                if (menuItem.type === 'group') {
                    if (findAndActivateMenuItem(menuItem.items)) {
                        menuItem.data.active = true;
                    }
                }

                if (menuItem.data.active) {
                    containsActiveMenuItem = true;
                }
            });

            return containsActiveMenuItem;
        };

        findAndActivateMenuItem(newState);
    } else if (action.type == 'open-submenu') {
        newState.forEach(menuItem => {
            menuItem.data.open = action.name == menuItem.data.name;
        });
    } else if (action.type == 'close-submenu') {
        newState.forEach(menuItem => {
            menuItem.data.open = false;
        });
    }

    return newState;
}

interface MainNavProps {
    openFooter: boolean;
}

const MainNav = styled.nav<MainNavProps>`
    ul,
    li {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    li {
        ${mixins.transition('border-color 0.2s ease')}
        position: relative;
    }

    a {
        ${mixins.transition('border-color 0.2s ease')}
        -webkit-font-smoothing: auto;
        text-decoration: none;
        display: block;
        color: #ccc;  // $color-menu-text;
        padding: 0.8em 1.7em;
        font-size: 1em;
        font-weight: normal;
        // Note, font-weights lower than normal,
        // and font-size smaller than 1em (80% ~= 12.8px),
        // makes the strokes thinner than 1px on non-retina screens
        // making the text semi-transparent
        &:hover,
        &:focus {
            background-color: rgba(100, 100, 100, 0.15);  // $nav-item-hover-bg;
            color: #fff;  // $color-white
            text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);
        }
    }

    .menu-item a {
        position: relative;
        white-space: nowrap;
        border-left: 3px solid transparent;

        &:before {
            font-size: 1rem;
            vertical-align: -15%;
            margin-right: 0.5em;
        }

        // only really used for spinners and settings menu
        &:after {
            font-size: 1.5em;
            margin: 0;
            position: absolute;
            right: 0.5em;
            top: 0.5em;
            margin-top: 0;
        }

    }

    .menu-active {
        background: #1a1a1a;  // $nav-item-active-bg;
        text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);

        > a {
            border-left-color: #f37e77;  // $color-salmon;
            color: #fff;  // $color-white
        }
    }

    .footer-submenu {
        a {
            border-left: 3px solid transparent;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:before {
                font-size: 1rem;
                margin-right: 0.5em;
                vertical-align: -10%;
            }
        }
    }

    .account {
        display: none;
    }

    *:focus {
        ${mixins.showFocusOutlineInside()}
    }

    .icon--menuitem {
        width: 1.25em;
        height: 1.25em;
        margin-right: 0.5em;
        vertical-align: text-top;
    }

    .icon--submenu-trigger {
        // The menus are collapsible on desktop only.
        display: none;


        ${smBreakpoint(css`
            display: block;
            width: 1.5em;
            height: 1.5em;
            position: absolute;
            top: 0.8125em;
            right: 0.5em;
            ${mixins.transition('transform 0.3s ease')}

            .menu-item.submenu-active & {
                transform-origin: 50% 50%;
                transform: rotate(180deg);
            }
        `)}
    }

    .icon--submenu-header {
        display: block;
        width: 4rem;
        height: 4rem;
        margin: 0 auto 0.8em;
        opacity: 0.15;
    }

    .nav-submenu {
        background: #262626;  // $nav-submenu-bg;

        h2 {
            display: none;
        }

        .menu-item a {
            white-space: normal;
            padding: 0.9em 1.7em 0.9em 4.5em;

            &:before {
                margin-left: -1.5em;
            }

            .icon--menuitem {
                margin-left: -1.75em;
            }

            &:hover {
                background-color: rgba(100, 100, 100, 0.2);
            }
        }

        li {
            border: 0;
        }

        &__footer {
            margin: 0;
            padding: 0.9em 1.7em;
            text-align: center;
            color: #ccc;  // $color-menu-text;
        }
    }

    ${smBreakpoint(css`
        overflow: auto;
        margin-bottom: ${(props: MainNavProps) => props.openFooter ? '127px' /* $nav-footer-open-height */: '50px' /* $nav-footer-closed-height */};

        ${mixins.transition('margin-bottom 0.2s ease')}

        .footer {
            position: fixed;
            width: 200px;  // $menu-width;
            bottom: 0;
            background-color: #262626;  // $nav-footer-submenu-bg;
        }

        .footer-submenu {
            ${mixins.transition('max-height 0.2s ease')}

            max-height: ${(props: MainNavProps) => {
                console.log(props)
                return props.openFooter ? '77px' /* $nav-footer-submenu-height */: '0'
            }};
        }

        .account {
            ${mixins.clearfix()}
            background: #1a1a1a;  // $nav-footer-account-bg;
            color: #ccc;  // $color-menu-text;
            text-transform: uppercase;
            display: block;
            cursor: pointer;

            &:hover {
                background-color: rgba(100, 100, 100, 0.15);
                color: #fff;  // $color-white
                text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);
            }

            .avatar {
                float: left;
                margin-right: 0.9em;

                &:before {
                    color: inherit;
                    border-color: inherit;
                }
            }

            em {
                box-sizing: border-box;
                padding-right: 1.8em;
                margin-top: 1.2em;
                font-style: normal;
                font-weight: 700;
                width: 110px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                float: left;

                &:after {
                    font-size: 1.5em;
                    position: absolute;
                    right: 0.25em;
                }
            }
        }
    }

    .nav-submenu {
        transform: translate3d(0, 0, 0);
        position: fixed;
        height: 100vh;
        width: 0;
        padding: 0;
        top: 0;
        left: 200px;  // $menu-width;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        h2,
        &__list {
            width: 200px;  // $menu-width;
        }

        h2 {
            display: block;
            padding: 0.2em 0;
            font-size: 1.2em;
            font-weight: 500;
            text-transform: none;
            text-align: center;
            color: #ccc;  // $color-menu-text;

            &:before {
                font-size: 4em;
                display: block;
                text-align: center;
                margin: 0 0 0.2em;
                width: 100%;
                opacity: 0.15;
            }
        }

        &__list {
            overflow: auto;
            flex-grow: 1;
        }

        &__footer {
            line-height: 50px;  // $nav-footer-closed-height;
            padding: 0;
        }

    }

    li.submenu-active {
        background: #262626;  // $nav-submenu-bg;

        > a {
            text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);

            &:hover {
                background-color: transparent;
            }
        }

        .nav-submenu {
            ${mixins.transition('width 0.2s ease')}

            box-shadow: 2px 0 2px rgba(0, 0, 0, 0.35);
            width: 200px;  // $menu-width;

            a {
                padding-left: 3.5em;
            }
        }
    `)}

    ///////////////
    // Z-indexes //
    ///////////////

    // Avoiding a stacking context for the content-wrapper saves us a world
    // of pain when dealing with overlays that are appended to the end of
    // <body>, eg Hallo & calendars. As long as content-wrapper remains floated,
    // the z-index shouldn't be required.

    .nav-submenu {
        z-index: 6;
    }

    footer {
        z-index: 100;
    }

    ${smBreakpoint(css`
        .footer {
            z-index: 2;
        }

        .nav-submenu {
            z-index: 500;
        }

        // footer is z-index: 100, so ensure the navigation sits on top of it.
        .submenu-active {
            z-index: 200;
        }
    `)}
`;

interface MenuProps {
    initialState: MenuData;
    user: ShellProps['user'];
    accountUrl: string;
    logoutUrl: string;
    navigate(url: string): void;
}

export const Menu: React.FunctionComponent<MenuProps> = ({initialState, user, accountUrl, logoutUrl, navigate}) => {
    const [state, dispatch] = React.useReducer(menuReducer, initialState);
    const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);

    const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.target instanceof HTMLAnchorElement) {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('/')) {
                e.preventDefault();
                navigate(href);
            }
        }
    };

    const onClickAccountSettings = (e: React.MouseEvent) => {
        e.preventDefault();
        setAccountSettingsOpen(!accountSettingsOpen);
    }

    return (
        <MainNav openFooter={accountSettingsOpen}>
            <ul>
                {renderMenuItems(state, dispatch, navigate)}

                <li className="footer">
                    <div className="account" title={gettext('Edit your account')} onClick={onClickAccountSettings}>
                        <span className="avatar square avatar-on-dark">
                            <img src={user.avatarUrl} alt="" />
                        </span>
                        <em className={'icon ' + (accountSettingsOpen ? 'icon-arrow-down-after' : 'icon-arrow-up-after')}>{user.name}</em>
                    </div>

                    <ul className="footer-submenu">
                        <li><a href={accountUrl} onClick={onClickLink} className="icon icon-user">{gettext('Account settings')}</a></li>
                        <li><a href={logoutUrl} onClick={onClickLink} className="icon icon-logout">{gettext('Log out')}</a></li>
                    </ul>
                </li>
            </ul>
        </MainNav>
    );
}
