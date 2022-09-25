/* eslint-disable react/no-danger, react/prop-types */

import React, { ReactElement } from "react";
import styled from "styled-components";
import { FormWidgetChangeNotificationContext } from "../../contexts";

const StyledTextInput = styled.input`
    background-color: var(--color--grey-hover);
    border: 1px solid var(--color--grey-line);
    color: var(--color--grey-dark);
    border-radius: 5px;
    padding: 8px 15px;
    width: 100%;
    box-sizing: border-box;

    font-size: 17px;
    line-height: 27px;

    .field-has-error & {
        border: 1px solid var(--color--red);
    }

    &:disabled {
        background-color: hsl(0, 0%, 95%);
    }

    &.monospace {
        font-family: var(--font-family--monospace);
    }

    &:focus {
        border: 1px solid var(--color--teal-light);
        outline: 1px solid var(--color--teal-light);
    }
`;

const TextInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(
    (
        {
            onChange: originalOnChange,
            ...props
        }: React.InputHTMLAttributes<HTMLInputElement>,
        ref
    ): ReactElement => {
        const changeNotification = React.useContext(
            FormWidgetChangeNotificationContext
        );

        return (
            <StyledTextInput
                type="text"
                ref={ref}
                onChange={(e) => {
                    if (originalOnChange) {
                        originalOnChange(e);
                    }
                    changeNotification();
                }}
                {...props}
            />
        );
    }
);

export default TextInput;
