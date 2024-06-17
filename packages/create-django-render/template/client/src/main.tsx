import React from "react";
import ReactDOM from "react-dom/client";
import * as DjangoRender from "@django-render/core";
import "./index.css";

import HomeView from "./views/Home";
import { CSRFTokenContext } from "./contexts";
import FormDef from "./deserializers/Form";
import FieldDef from "./deserializers/Field";
import ServerRenderedFieldDef from "./deserializers/ServerRenderedField";
import TextInputDef from "./deserializers/widgets/TextInput";
import SelectDef from "./deserializers/widgets/Select";

const config = new DjangoRender.Config();

// Add your views here
config.addView("Home", HomeView);

// Add your context providers here
config.addContextProvider("csrf_token", CSRFTokenContext);

// Add your deserializers here
config.addDeserializer("forms.Form", FormDef);
config.addDeserializer("forms.Field", FieldDef);
config.addDeserializer("forms.ServerRenderedField", ServerRenderedFieldDef);
config.addDeserializer("forms.TextInput", TextInputDef);
config.addDeserializer("forms.Select", SelectDef);

const rootElement = document.getElementById("root")!;
const initialResponse = JSON.parse(
  document.getElementById("initial-response")!.textContent!
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoRender.App config={config} initialResponse={initialResponse} />
  </React.StrictMode>
);
