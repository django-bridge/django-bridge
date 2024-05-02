import WidgetDef from "../Widget";

export default class SelectDef implements WidgetDef {
  idForLabel: string;

  choices: { label: string; value: string }[];

  className: string;

  constructor(
    idForLabel: string,
    choices: { label: string; value: string }[],
    className: string
  ) {
    this.idForLabel = idForLabel;
    this.choices = choices;
    this.className = className;
  }

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
