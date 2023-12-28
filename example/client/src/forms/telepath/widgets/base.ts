import { ReactElement } from "react";

export interface WidgetDef {
  helpTextPosition?: "before" | "after";

  floatLeft?: boolean;

  render(
    id: string,
    name: string,
    disabled: boolean,
    value: string
  ): ReactElement;
  getIdForLabel(id: string): string;
}
