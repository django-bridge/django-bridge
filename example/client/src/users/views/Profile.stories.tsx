import React from "react";
import { ComponentMeta } from "@storybook/react";

import UserProfileView from "./Profile";
import FormDef from "../../forms/telepath/Form";
import FieldDef from "../../forms/telepath/Field";
import TextInputDef from "../../forms/telepath/widgets/TextInput";
import { createTestUser } from "../testdata";

export default {
  title: "Views/Users/Profile",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: UserProfileView,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof UserProfileView>;

export function Page() {
  return (
    <UserProfileView
      {...{
        user: createTestUser(),
        csrfToken: "",
        actionUrl: "#",
        form: new FormDef(
          [
            new FieldDef(
              "first_name",
              "First name",
              false,
              false,
              new TextInputDef("text", "__ID__", ""),
              "",
              "Bender"
            ),
            new FieldDef(
              "last_name",
              "Last name",
              false,
              false,
              new TextInputDef("text", "__ID__", ""),
              "",
              "Rodríguez"
            ),
          ],
          {}
        ),
      }}
    />
  );
}
