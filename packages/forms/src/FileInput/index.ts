import WidgetDef from "../Widget";

export default class FileInputDef implements WidgetDef {
  idForLabel: string;

  className: string;

  accept: string;

  maxFileSizeDisplay: string;

  constructor(
    idForLabel: string,
    className: string,
    accept: string,
    maxFileSizeDisplay: string
  ) {
    this.idForLabel = idForLabel;
    this.className = className;
    this.accept = accept;
    this.maxFileSizeDisplay = maxFileSizeDisplay;
  }

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
