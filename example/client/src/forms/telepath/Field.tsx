import React, { ReactElement } from "react";
import { WidgetDef } from "./widgets/base";
import Field, { FieldProps } from "../components/Field";

export default class FieldDef {
  name: string;

  label: string;

  required: boolean;

  disabled: boolean;

  widget: WidgetDef;

  helpText: string;

  value: string;

  constructor(
    name: string,
    label: string,
    required: boolean,
    disabled: boolean,
    widget: WidgetDef,
    helpText: string,
    value: string
  ) {
    this.name = name;
    this.label = label;
    this.required = required;
    this.disabled = disabled;
    this.widget = widget;
    this.helpText = helpText;
    this.value = value;
  }

  render(
    errors: string[],
    displayOptions: FieldProps["displayOptions"] = {}
  ): ReactElement {
    if (this.widget.helpTextPosition === "before") {
      displayOptions.helpTextAboveWidget = true;
    }

    if (this.widget.floatLeft) {
      displayOptions.widgetFloatLeft = true;
    }

    return (
      <Field
        idForLabel={this.widget.getIdForLabel(this.name)}
        label={this.label}
        required={this.required}
        widget={this.widget.render(
          this.name,
          this.name,
          this.disabled,
          this.value
        )}
        helpText={this.helpText}
        displayOptions={displayOptions}
        errors={errors}
      />
    );
  }
}
