/* eslint-disable react/no-danger */

import React, { ReactElement } from "react";
import ServerRenderedWidget from "../../components/widgets/ServerRenderedWidget";
import { WidgetDef } from "./base";

export default class ServerRenderedWidgetDef implements WidgetDef {
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
            <ServerRenderedWidget
                html={this.html}
                id={id}
                name={name}
                value={value}
            />
        );
    }

    getIdForLabel(id: string): string {
        this.idForLabel.replace("__ID__", id);
    }
}
