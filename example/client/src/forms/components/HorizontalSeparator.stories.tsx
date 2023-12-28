import React from "react";
import { ComponentMeta } from "@storybook/react";
import styled from "styled-components";

import HorizontalSeparator from "./HorizontalSeparator";

export default {
  title: "Components/Forms/Horizontal Separator",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: HorizontalSeparator,
} as ComponentMeta<typeof HorizontalSeparator>;

const Wrapper = styled.div`
  width: 530px;
`;

export function Basic() {
  return (
    <Wrapper>
      <HorizontalSeparator />
    </Wrapper>
  );
}
