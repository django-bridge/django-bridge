import React from "react";
import styled, { css } from "styled-components";
import { FormSubmissionStatus } from "../../forms/contexts";

import Link from "./Link";
import { SpinnerIcon } from "./LoadingSpinner";

const BaseStyle = css`
    position: relative;

    transition: background-color 0.1s ease, border-color 0.1s ease,
        color 0.1s ease;

    display: inline-flex;
    flex-flow: row nowrap;
    gap: 6px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
        cursor: pointer;
    }

    &:disabled {
        cursor: unset;
    }

    > svg {
        width: 17px;
        max-height: 17px;
    }
`;

const RegularSizeStyle = css`
    padding: 12px 15px;
    font-size: 16px;
    font-weight: 700;
`;

const SmallSizeStyle = css`
    padding: 7px 9px;
    font-size: 14px;
    font-weight: 600;
`;

const PrimaryKindStyle = css`
    background-color: var(--color--teal);
    color: white;
    border: none;

    &:hover {
        background-color: #005b5e;
    }

    &:disabled {
        background-color: #767676;
    }
`;

const SecondaryKindStyle = css`
    background-color: var(--color--white);
    color: var(--color--teal);
    border: 1px solid var(--color--teal);
    box-sizing: border-box;

    &:hover {
        background-color: var(--color--teal-tint);
        color: #005b5e;
        border-color: #005b5e;
    }

    &:disabled {
        background-color: var(--color--white);
        color: #767676;
        border-color: #767676;
    }
`;

const DangerKindStyle = css`
    background-color: var(--color--red);
    color: white;
    border: none;

    &:hover {
        background-color: var(--color--red-dark);
    }

    &:disabled {
        background-color: #767676;
    }
`;

const GhostKindStyle = css`
    background-color: transparent;
    color: var(--color--teal-light);
    border: 1px solid var(--color--teal-light);
    box-sizing: border-box;

    &:hover {
        color: var(--color--teal-tint);
        border-color: var(--color--teal-tint);
    }

    &:disabled {
        color: #767676;
        border-color: #767676;
    }
`;

interface LinkButtonInternalProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    kind?: "primary" | "secondary" | "danger" | "ghost";
    size?: "normal" | "small";
}

export const LinkButton = styled(Link)<{
    kind?: LinkButtonInternalProps["kind"];
    size?: LinkButtonInternalProps["size"];
}>`
    ${BaseStyle}

    ${({ size }) => {
        if (size === "small") {
            return SmallSizeStyle;
        }

        return RegularSizeStyle;
    }}

    ${({ kind }) => {
        if (kind === "secondary") {
            return SecondaryKindStyle;
        }

        if (kind === "danger") {
            return DangerKindStyle;
        }

        if (kind === "ghost") {
            return GhostKindStyle;
        }

        return PrimaryKindStyle;
    }}
`;

export const HTMLButton = styled.button<{
    kind?: LinkButtonInternalProps["kind"];
    size?: LinkButtonInternalProps["size"];
    isSubmitting?: boolean;
}>`
    ${BaseStyle}

    ${({ size }) => {
        if (size === "small") {
            return SmallSizeStyle;
        }

        return RegularSizeStyle;
    }}

    ${({ kind }) => {
        if (kind === "secondary") {
            return SecondaryKindStyle;
        }

        if (kind === "danger") {
            return DangerKindStyle;
        }

        if (kind === "ghost") {
            return GhostKindStyle;
        }

        return PrimaryKindStyle;
    }}

    ${({ isSubmitting }) => {
        if (isSubmitting) {
            return css`
                padding-left: 33px;
                pointer-events: none;
            `;
        }

        return css``;
    }}
`;

interface CommonButtonProps {
    kind?: "primary" | "secondary" | "danger" | "ghost";
    size?: "normal" | "small";
    disabled?: boolean;
    style?: React.CSSProperties;
}

interface LinkButtonProps extends CommonButtonProps, LinkButtonInternalProps {
    type: "link";
    href: string;
}

interface SubmitButtonProps extends CommonButtonProps {
    type: "submit";
    name?: string;
    value?: string;
    hideSpinner?: boolean;
}

interface ButtonProps extends CommonButtonProps {
    type: "button";
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SpinnerIconWrapper = styled.span`
    position: absolute;
    left: 10px;
    top: calc(50% - 8px);

    svg {
        display: inline;
        width: 16px;
        height: 16px;
    }
`;

export default function Button({
    children,
    ...props
}: React.PropsWithChildren<
    LinkButtonProps | SubmitButtonProps | ButtonProps
>): React.ReactElement {
    const { type, kind } = props;

    const isSubmitting = React.useContext(FormSubmissionStatus);

    if (type === "link") {
        return <LinkButton {...props}>{children}</LinkButton>;
    }

    if (type === "submit") {
        const { hideSpinner = false } = props;

        return (
            <HTMLButton isSubmitting={isSubmitting} {...props}>
                {isSubmitting && !hideSpinner && (
                    <SpinnerIconWrapper>
                        <SpinnerIcon
                            strokeWidth={32}
                            color={
                                kind === "danger"
                                    ? "var(--color--white)"
                                    : undefined
                            }
                        />
                    </SpinnerIconWrapper>
                )}
                {children}
            </HTMLButton>
        );
    }

    return <HTMLButton {...props}>{children}</HTMLButton>;
}
