import React from 'react';

 // @ts-ignore
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import './transitions.scss';

const TRANSITION_DURATION = 210;

// The available transitions. Must match the class names in CSS.
export const PUSH = 'push';
export const POP = 'pop';

interface TransitionProps {
    name: typeof PUSH | typeof POP;
    component?: string;
    className?: string;
    duration?: number;
    label?: string;
}

/**
 * Wrapper arround react-transition-group with default values.
 */
const Transition: React.FunctionComponent<TransitionProps> = ({
    name,
    component='div',
    className,
    duration=TRANSITION_DURATION,
    children,
    label,
}) => (
    <CSSTransitionGroup
        component={component}
        transitionEnterTimeout={duration}
        transitionLeaveTimeout={duration}
        transitionName={`c-transition-${name}`}
        className={className}
        aria-label={label}
    >
        {children}
    </CSSTransitionGroup>
);

export default Transition;
