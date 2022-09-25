import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import ToastMessage from "./ToastMessages";

export default {
    title: "Components/Shell/Toast Message",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ToastMessage,
} as ComponentMeta<typeof ToastMessage>;

// eslint-disable-next-line react/function-component-definition, react/prop-types
const Template: ComponentStory<typeof ToastMessage> = (args) => (
    <ToastMessage {...args} />
);

export const Success = Template.bind({});
Success.args = {
    messages: [
        {
            level: "success",
            text: "Hello world!",
        },
    ],
};

export const Multiple = Template.bind({});
Multiple.args = {
    messages: [
        {
            level: "success",
            text: "Hello world!",
        },
        {
            level: "success",
            text: "Another message!",
        },
    ],
};

export const Warning = Template.bind({});
Warning.args = {
    messages: [
        {
            level: "warning",
            text: "This is a warning!",
        },
    ],
};

export const Error = Template.bind({});
Error.args = {
    messages: [
        {
            level: "error",
            text: "This is an error!",
        },
    ],
};

export const HTML = Template.bind({});
HTML.args = {
    messages: [
        {
            level: "success",
            html: 'Testing HTML. <a href="https://wagtail.cloud">Here\'s a link</a>',
        },
    ],
};
