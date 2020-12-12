import React from 'react';
import Button from './common/Button';
import Icon from './common/Icon';
import { ExplorerContext, ShellProps } from '../main';

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

interface MenuProps {
    initialState: MenuData;
    user: ShellProps['user'];
    accountUrl: string;
    logoutUrl: string;
    navigate(url: string): void;
}

export const Menu: React.FunctionComponent<MenuProps> = ({initialState, user, accountUrl, logoutUrl, navigate}) => {
    const [state, dispatch] = React.useReducer(menuReducer, initialState);

    const onClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.target instanceof HTMLAnchorElement) {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('/')) {
                e.preventDefault();
                navigate(href);
            }
        }
    };

    return (
        <nav className="nav-main">
            <ul>
                {renderMenuItems(state, dispatch, navigate)}

                <li className="footer" id="footer">
                    <div className="account" id="account-settings" title={gettext('Edit your account')}>
                        <span className="avatar square avatar-on-dark">
                            <img src={user.avatarUrl} alt="" />
                        </span>
                        <em className="icon icon-arrow-up-after">{user.name}</em>
                    </div>

                    <ul className="footer-submenu">
                        <li><a href={accountUrl} onClick={onClickLink} className="icon icon-user">{gettext('Account settings')}</a></li>
                        <li><a href={logoutUrl} onClick={onClickLink} className="icon icon-logout">{gettext('Log out')}</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}
