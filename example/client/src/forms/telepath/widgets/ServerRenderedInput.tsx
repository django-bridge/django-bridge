/* eslint-disable react/no-danger */

import React, { ReactElement } from "react";
import ServerRenderedInput from "../../components/widgets/ServerRenderedInput";
import { WidgetDef } from "./base";

export default class ServerRenderedInputetDef implements WidgetDef {
    html: string;

    idForLabel: string;

    constructor(html: string, idForLabel: string) {
        this.html = html;
        this.idForLabel = idForLabel;
    }

    render(
        id: string,
        name: string,
        disabled: boolean,
        value: string
    ): ReactElement {
        return (
            <ServerRenderedInput
                html={this.html}
                id={id}
                name={name}
                value={value}
            />
        );
    }

    getIdForLabel(id: string): string {
        return this.idForLabel.replace("__ID__", id);
    }
}
