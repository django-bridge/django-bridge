import WidgetDef from "../Widget";

export default class SelectMultipleDef implements WidgetDef {
  idForLabel: string;

  choices: { label: string; value: number | string }[];

  className: string;

  inline: boolean;

  constructor(
    idForLabel: string,
    choices: { label: string; value: number | string }[],
    className: string,
    inline: boolean
  ) {
    this.idForLabel = idForLabel;
    this.choices = choices;
    this.className = className;
    this.inline = inline;
  }

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
