import React from "react";
import styled, { keyframes } from "styled-components";
import { DirtyFormContext } from "../../forms/dirtyform";
import Icon from "../../icons";
import Button from "./Button";

const MainWrapper = styled.main`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const ContainerWrapper = styled.div`
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 120px;
  padding-right: 120px;
  padding-top: 50px;
  padding-bottom: 50px;
  box-sizing: border-box;

  @media only screen and (max-width: 1000px) {
    padding-left: 60px;
    padding-right: 60px;
  }

  @media only screen and (max-width: 650px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const slideInUnsavedChangesWarning = keyframes`
    from {
        margin-top: -50px;
    }

    to {
        margin-top: 0
    }
`;

const UnsavedChangesWarningOuterWrapper = styled.div`
  width: 100%;
  background-color: #ffdadd;
  height: 50px;
  margin-top: 0;
  animation: ${slideInUnsavedChangesWarning} 0.5s ease;
`;

const UnsavedChangesWarningInnerWrapper = styled(ContainerWrapper)`
  height: 50px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 20px;
  color: var(--color--indigo);
  font-size: 15px;
  font-weight: 400;
  padding-top: 0;
  padding-bottom: 0;

  svg {
    color: var(--color--red);
    height: 18px;
  }

  b {
    font-weight: 700;
  }
`;

const Container = React.forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<HTMLDivElement>
>(
  (
    { children, ...props }: React.InputHTMLAttributes<HTMLDivElement>,
    ref
  ): React.ReactElement => {
    const { unloadRequested, confirmUnload } =
      React.useContext(DirtyFormContext);

    return (
      <MainWrapper>
        {unloadRequested && (
          <UnsavedChangesWarningOuterWrapper>
            <UnsavedChangesWarningInnerWrapper
              role="alert"
              aria-live="assertive"
            >
              <Icon name="fa/exclamation-triangle-solid" />
              <p>
                <b>You have unsaved changes.</b> Please save your changes before
                leaving.
              </p>
              <Button
                type="button"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUnload();
                }}
              >
                Leave without saving
              </Button>
            </UnsavedChangesWarningInnerWrapper>
          </UnsavedChangesWarningOuterWrapper>
        )}
        <ContainerWrapper ref={ref} {...props}>
          {children}
        </ContainerWrapper>
      </MainWrapper>
    );
  }
);

export default Container;
