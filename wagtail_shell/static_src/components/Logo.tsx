import React from 'react';
import styled, { css } from 'styled-components';

interface LogoWrapperProps {
    collapsed: boolean;
}

const LogoWrapper = styled.a<LogoWrapperProps>`
    display: block;
    align-items: center;
    color: #aaa;
    -webkit-font-smoothing: auto;
    position: relative;
    display: block;
    margin: 2em auto;
    text-align: center;
    padding: 0.6em 1.2em;
    transition: padding 0.3s ease;

    &:hover {
        color: $color-white;
    }

    ${(props) => props.collapsed && css`
        padding: 1em 0.1em;
    `}
`;

const LogoMobileWrapper = styled.div<LogoWrapperProps>`
    margin-right: 10px;
    background-color: #555;
    border-radius: 50%;
    padding: 5px 7.5px;

    .wagtail-logo {
        width: 20px;
        float: left;
        border: 0;
    }
`;

interface LogoDesktopWrapperProps extends LogoWrapperProps {
    isWagging: boolean;
}

const LogoDesktopWrapper = styled.div<LogoDesktopWrapperProps>`
    @keyframes tail-wag {
        from {
            transform: rotate(-3deg);
        }

        to {
            transform: rotate(7deg);
        }
    }

    position: relative;
    width: 100px;
    height: 100px;
    background-color: #555;
    border-radius: 50%;
    margin: 0 auto;
    transition: transform 0.3s cubic-bezier(0.28, 0.15, 0, 2.1), width 0.3s ease, height 0.3s ease;

    ${(props) => props.collapsed && css`
        width: 40px;
        height: 40px;
    `}

    .page404__bg & {
        background-color: transparent;
    }

    > div {
        margin: auto;
        position: relative;
        width: 52px;
        height: 100px;
        transition: width 0.3s ease, height 0.3s ease;

        ${(props) => props.collapsed && css`
            width: 20px;
            height: 40px;
        `}

        .page404__bg & {
            width: auto;
            height: auto;
            position: static;
        }
    }

    img {
        display: block;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        transition: inherit;

        &[data-part="eye--open"] {
            // stylelint-disable-next-line declaration-no-important
            display: inline !important; // doesn't work without !important, likely a specificity issue
        }

        &[data-part="eye--closed"] {
            // stylelint-disable-next-line declaration-no-important
            display: none !important;
        }
    }

    &:hover {
        ${(props) => props.isWagging ? css`
            // Wagtail 'playful' animation (tail-wag, triggered by JS in base.html):
            transform: rotate(8deg);
            transition: transform 1.2s ease;

            img {
                // stylelint-disable max-nesting-depth
                &[data-part="tail"] {
                    animation: tail-wag 0.09s alternate;
                    animation-iteration-count: infinite;
                }

                &[data-part="eye--open"] {
                    // stylelint-disable-next-line declaration-no-important
                    display: none !important;
                }

                &[data-part="eye--closed"]{
                    // stylelint-disable-next-line declaration-no-important
                    display: inline !important;
                }
            }
        ` : css`
            // Wagtail 'serious' animation (nod):
            transform: rotate(4deg);
        `}
    }
`;

export interface LogoImages {
    mobileLogo: string;
    desktopLogoBody: string
    desktopLogoTail: string;
    desktopLogoEyeOpen: string;
    desktopLogoEyeClosed: string;
}

interface LogoProps {
    collapsed: boolean;
    images: LogoImages;
    homeUrl: string;
    navigate(url: string): void;
}

export const Logo: React.FunctionComponent<LogoProps> = ({collapsed, images, homeUrl, navigate}) => {
    // Tail wagging
    // If the pointer changes direction 8 or more times without leaving, wag the tail!
    const lastMouseX = React.useRef(0);
    const lastDir = React.useRef<'r' | 'l'>('r');
    const dirChangeCount = React.useRef(0);
    const [isWagging, setIsWagging] = React.useState(false);


    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(homeUrl);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        const mouseX = e.pageX;
        const dir: 'r' | 'l' = (mouseX > lastMouseX.current) ? 'r' : 'l';

        if (mouseX != lastMouseX.current && dir != lastDir.current) {
            dirChangeCount.current += 1;
        }

        if (dirChangeCount.current > 8) {
            setIsWagging(true);
        }

        lastMouseX.current = mouseX;
        lastDir.current = dir;
    };

    const onMouseLeave = () => {
        setIsWagging(false);
        dirChangeCount.current = 0;
    };

    return (
        <LogoWrapper collapsed={collapsed} href="#" onClick={onClick} aria-label={gettext('Dashboard')}>
            {/* Mobile */}
            <LogoMobileWrapper collapsed={collapsed} className="u-hidden@sm">
                <img src={images.mobileLogo} alt="" width="80" />
            </LogoMobileWrapper>

            {/* Desktop (animated) */}
            <LogoDesktopWrapper collapsed={collapsed} className="u-hidden@xs" isWagging={isWagging} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                <div>
                    <img data-part="body" src={images.desktopLogoBody} alt=""/>
                    <img data-part="tail" src={images.desktopLogoTail} alt="" />
                    <img data-part="eye--open" src={images.desktopLogoEyeOpen} alt="" />
                    <img data-part="eye--closed" src={images.desktopLogoEyeClosed} alt="" />
                </div>
            </LogoDesktopWrapper>
            <span className="u-hidden@sm">{gettext('Dashboard')}</span>
        </LogoWrapper>
    );
}
