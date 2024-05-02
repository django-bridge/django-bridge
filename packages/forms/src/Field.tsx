import WidgetDef from "./Widget";

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
}
