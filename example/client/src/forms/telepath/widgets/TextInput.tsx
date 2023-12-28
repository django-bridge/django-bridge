import React, { ReactElement } from "react";
import TextInput from "../../components/widgets/TextInput";
import { WidgetDef } from "./base";

export default class TextInputDef implements WidgetDef {
  type: "text" | "email" | "url";

  idForLabel: string;

  className: string;

  constructor(
    type: TextInputDef["type"],
    idForLabel: string,
    className: string
  ) {
    this.type = type;
    this.idForLabel = idForLabel;
    this.className = className;
  }

  render(
    id: string,
    name: string,
    disabled: boolean,
    value: string
  ): ReactElement {
    return (
      <TextInput
        id={id}
        type={this.type}
        name={name}
        defaultValue={value}
        disabled={disabled}
        className={this.className}
      />
    );
  }

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
