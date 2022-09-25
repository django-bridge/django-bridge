import React from "react";
import { ComponentMeta } from "@storybook/react";

import ModalWindow from "./ModalWindow";
import ModalWindowHeader from "../../lib/components/ModalWindowHeader";

export default {
    title: "Components/Shell/Modal Window",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ModalWindow,
} as ComponentMeta<typeof ModalWindow>;

export function Basic() {
    return (
        <ModalWindow side="right" onClose={() => {}}>
            <ModalWindowHeader />
            <div style={{ paddingTop: "80px", marginLeft: "50px" }}>
                This is a test modal window
            </div>
        </ModalWindow>
    );
}
