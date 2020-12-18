import React from 'react';

export interface LogoImages {
    mobileLogo: string;
    desktopLogoBody: string
    desktopLogoTail: string;
    desktopLogoEyeOpen: string;
    desktopLogoEyeClosed: string;
}

interface LogoProps {
    images: LogoImages;
    homeUrl: string;
    navigate(url: string): void;
}

export const Logo: React.FunctionComponent<LogoProps> = ({images, homeUrl, navigate}) => {
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

    const desktopClassNames = ["wagtail-logo-container__desktop", "u-hidden@xs"];
    if (isWagging) {
        desktopClassNames.push('logo-playful');
    } else {
        desktopClassNames.push('logo-serious');
    }

    return (
        <a href="#" onClick={onClick} className="logo" aria-label={gettext('Dashboard')}>
            {/* Mobile */}
            <div className="wagtail-logo-container__mobile u-hidden@sm">
                <img className="wagtail-logo wagtail-logo__full" src={images.mobileLogo} alt="" width="80" />
            </div>

            {/* Desktop (animated) */}
            <div className={desktopClassNames.join(' ')} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
                <div className="wagtail-logo-container-inner">
                    <img className="wagtail-logo wagtail-logo__body" src={images.desktopLogoBody} alt=""/>
                    <img className="wagtail-logo wagtail-logo__tail" src={images.desktopLogoTail} alt="" />
                    <img className="wagtail-logo wagtail-logo__eye--open" src={images.desktopLogoEyeOpen} alt="" />
                    <img className="wagtail-logo wagtail-logo__eye--closed" src={images.desktopLogoEyeClosed} alt="" />
                </div>
            </div>
            <span className="u-hidden@sm">{gettext('Dashboard')}</span>
        </a>
    );
}
