import WidgetDef from "../Widget";

export default class TextInputDef implements WidgetDef {
  type: "text" | "email" | "url" | "password";

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

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
