// Replicates Wagtail's builtin SCSS breakpoint mixins

// screen breakpoints
const breakpoints: {[name: string]: string} = {
    xs: '0',
    sm: '50em',    // 800px
    md: '56.25em', // 900px
    lg: '75em',    // 1200px
    xl: '100em',   // 1440px
};

const nextBreakpoints: {[name: string]: string} = {
    'xs': 'sm',
    'sm': 'md',
    'lg': 'xl',
};

export function breakpointNext(name: string): string | null {
    return nextBreakpoints[name] || null;
}

export function breakpointMin(name: string): string | null {
    return breakpoints[name] || null;
}

export function breakpointMax(name: string): string | null {
    const nextBreakpoint = breakpointNext(name);
    if (!nextBreakpoint) {
        return null;
    }

    const value = breakpoints[nextBreakpoint];

    if (value) {
        return value + ' - 0.0625em';
    } else {
        return null;
    }
}

export function mediaBreakpointUp(name: string) {
    return (wrappedCss: string) => {
        const min = breakpointMin(name);

        if (min) {
            return `
                @media screen and (min-width: ${min}) {
                    ${wrappedCss}
                }
            `;
        } else {
            return wrappedCss;
        }
    };
}

export function mediaBreakpointDown() {
    return (wrappedCss: string) => {
        const max = breakpointMax(name);

        if (max) {
            return `
                @media screen and (max-width: ${max}) {
                    ${wrappedCss}
                }
            `;
        } else {
            return wrappedCss;
        }
    };
}
