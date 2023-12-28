import React, { ReactElement } from "react";
import FieldDef from "./Field";

export interface Tab {
  label: string;
  fields: string[];
  errorCount: number;
}

export function getInitialTab(tabs: Tab[]): Tab {
  return tabs.find((tab) => tab.errorCount > 0) || tabs[0];
}

export default class FormDef {
  fields: FieldDef[];

  errors: { [field: string]: string[] };

  constructor(fields: FieldDef[], errors: FormDef["errors"]) {
    this.fields = fields;
    this.errors = errors;
  }

  render(): ReactElement {
    return (
      <>
        {this.fields.map((field, fieldIndex) => (
          <div key={field.name}>
            {field.render(this.errors[field.name] || [], {
              focusOnMount: fieldIndex === 0,
            })}
          </div>
        ))}
      </>
    );
  }
}
