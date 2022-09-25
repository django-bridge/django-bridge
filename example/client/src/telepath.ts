/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

import { telepath } from "django-react-appshell";
import FieldDef from "./forms/telepath/Field";
import FormDef from "./forms/telepath/Form";
import ServerRenderedInputtDef from "./forms/telepath/widgets/ServerRenderedInput";
import TextInputDef from "./forms/telepath/widgets/TextInput";

telepath.register("forms.Form", FormDef);
telepath.register("forms.Field", FieldDef);
telepath.register("forms.ServerRenderedInput", ServerRenderedInputtDef);
telepath.register("forms.TextInput", TextInputDef);
telepath.register("Date", Date);

export default telepath;
