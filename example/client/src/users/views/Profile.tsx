/* eslint-disable react/require-default-props */

import React, { ReactElement } from "react";
import styled from "styled-components";
import ContentWrapper from "../../lib/components/ContentWrapper";
import Container from "../../lib/components/Container";
import { ModalWindowControlsContext } from "../../shell/components/ModalWindow";
import Form from "../../forms/components/Form";
import Button from "../../lib/components/Button";
import FormDef from "../../forms/telepath/Form";
import { User } from "../types";
import HorizontalSeparator from "../../forms/components/HorizontalSeparator";
import { ShellGlobalsContext } from "../../shell/contexts";

const ModalWrapper = styled.div`
    width: 100vw;
    min-height: 100vh;
    max-width: 650px;
    padding-left: 60px;
    padding-right: 60px;
    padding-top: 40px;
    box-sizing: border-box;

    @media only screen and (max-width: 600px) {
        padding-left: 30px;
        padding-right: 30px;
    }
`;

const LogoutButtonWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    padding: 20px;
    display: flex;
    gap: 10px;
`;

const HeaderWrapper = styled.div``;

const Avatar = styled.img`
    max-width: 100px;
    max-height: 100px;
    border-radius: 50%;
`;

const OrganisationList = styled.p`
    font-size: 16px;
    font-weight: 400;
    color: var(--color--indigo);
    margin-top: 20px;
`;

const NameWrapper = styled.h1`
    font-size: 38px;
    font-weight: 800;
    color: var(--color--indigo);
    margin-top: 20px;
`;

const MessageWrapper = styled.p`
    font-size: 16px;
    font-weight: 400;
    color: #707070;
    margin-top: 20px;
`;

const FormActionsWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    margin-top: 100px;
    margin-bottom: 40px;
`;

interface UserProfileViewContext {
    user: User;
    csrfToken: string;
    form: FormDef;
    actionUrl: string;
}

function UserProfileView({
    user,
    csrfToken,
    form,
    actionUrl,
}: UserProfileViewContext): ReactElement {
    const { isModal, close } = React.useContext(ModalWindowControlsContext);
    const { urls } = React.useContext(ShellGlobalsContext);

    const rendered = (
        <>
            <LogoutButtonWrapper>
                <Button
                    type="button"
                    kind="secondary"
                    size="small"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = urls.logout;
                    }}
                >
                    Log out
                </Button>
            </LogoutButtonWrapper>
            <HeaderWrapper>
                <Avatar src={user.avatarUrl} alt="Avatar" />
                <NameWrapper>{user.displayName}</NameWrapper>
            </HeaderWrapper>
            <Form action={actionUrl} method="post" noValidate>
                <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrfToken}
                />
                {form.render()}
                <HorizontalSeparator />
                <MessageWrapper>
                    To update your other details or delete your account, please
                    contact us.
                </MessageWrapper>
                <FormActionsWrapper>
                    <Button type="submit">Save profile</Button>
                    {isModal && (
                        <Button
                            type="button"
                            kind="secondary"
                            onClick={(e) => {
                                e.preventDefault();
                                close({ skipDirtyFormCheck: true });
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </FormActionsWrapper>
            </Form>
        </>
    );

    if (isModal) {
        return <ModalWrapper>{rendered}</ModalWrapper>;
    }

    return (
        <ContentWrapper>
            <Container>{rendered}</Container>
        </ContentWrapper>
    );
}

export default UserProfileView;
