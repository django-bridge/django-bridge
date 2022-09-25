// eslint-disable-next-line import/no-extraneous-dependencies
import { enableMapSet } from "immer";
import { OverrideLinks } from "../src/shell/storybook";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const decorators = [
    (Story) => (
        <OverrideLinks>
            <Story />
        </OverrideLinks>
    ),
];

enableMapSet();
