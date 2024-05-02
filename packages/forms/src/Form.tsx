import FieldDef from "./Field";

export default class FormDef {
  fields: FieldDef[];

  errors: { [field: string]: string[] };

  constructor(fields: FieldDef[], errors: FormDef["errors"]) {
    this.fields = fields;
    this.errors = errors;
  }
}
