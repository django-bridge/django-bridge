import WidgetDef from "../Widget";

export default class ServerRenderedInputDef implements WidgetDef {
  html: string;

  idForLabel: string;

  constructor(html: string, idForLabel: string) {
    this.html = html;
    this.idForLabel = idForLabel;
  }

  getIdForLabel(id: string): string {
    return this.idForLabel.replace("__ID__", id);
  }
}
