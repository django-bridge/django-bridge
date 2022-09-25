/* eslint-disable react/require-default-props */

import React, { ReactElement } from "react";
import styled from "styled-components";
import FormDef from "../../forms/telepath/Form";
import Button from "../../lib/components/Button";

const Wrapper = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background-color: #2e1f5e;
    height: 100vh;
`;

const LoginWrapper = styled.div`
    width: 24rem;
    border-radius: 0.5rem;
    padding: 2.5rem;
    background-color: white;

    h2 {
        color: #2e1f5e;
        font-weight: bold;
        font-size: 1.5rem;
        line-height: 2rem;
    }
`;

const SubmitButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1rem;
`;

interface LoginViewContext {
    csrfToken: string;
    form: FormDef;
    actionUrl: string;
}

function LoginView({
    csrfToken,
    form,
    actionUrl,
}: LoginViewContext): ReactElement {
    return (
        <Wrapper>
            <LoginWrapper>
                <h2>Django React AppShell Example</h2>

                <form action={actionUrl} method="post" noValidate>
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value={csrfToken}
                    />

                    {form.render()}

                    <SubmitButtonWrapper>
                        <Button type="submit">Log in</Button>
                    </SubmitButtonWrapper>
                </form>
            </LoginWrapper>
        </Wrapper>
    );
}
export default LoginView;
