import React, { ReactElement } from "react";
import { Navigation, NavigationContext } from "../contexts";

export interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
    skipDirtyFormCheck?: boolean;
}

export function buildLinkElement(
    { children, href, skipDirtyFormCheck = false, ...props }: LinkProps,
    { navigate }: Navigation,
    ref:
        | ((instance: HTMLAnchorElement | null) => void)
        | React.MutableRefObject<HTMLAnchorElement | null>
        | null
): ReactElement {
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href) {
            e.preventDefault();
            // eslint-disable-next-line no-void
            void navigate(href, { skipDirtyFormCheck });
        }
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
        <a onClick={onClick} href={href || "#"} ref={ref} {...props}>
            {children}
        </a>
    );
}

// Allow overriding of the Link element implementation. This is used for Storybook
export const BuildLinkElement = React.createContext(buildLinkElement);

const Link = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        // eslint-disable-next-line react/no-unused-prop-types
        skipDirtyFormCheck?: boolean;
    }
>((props: LinkProps, ref): ReactElement => {
    const navigationContext = React.useContext(NavigationContext);
    const build = React.useContext(BuildLinkElement);

    return build(props, navigationContext, ref);
});

export default Link;
