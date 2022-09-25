/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

import Telepath from "telepath-unpack";
import FieldDef from "./forms/telepath/Field";
import FormDef from "./forms/telepath/Form";
import ServerRenderedWidgetDef from "./forms/telepath/widgets/ServerRenderedInput";
import TextInputDef from "./forms/telepath/widgets/TextInput";

const telepath = new Telepath();

telepath.register("forms.Form", FormDef);
telepath.register("forms.Field", FieldDef);
telepath.register("forms.ServerRenderedInput", ServerRenderedWidgetDef);
telepath.register("forms.TextInput", TextInputDef);
telepath.register("Date", Date);

export default telepath;
