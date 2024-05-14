import React from "react";
import ReactDOM from "react-dom/client";
import * as DjangoRender from "@django-render/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const config = new DjangoRender.Config();
config.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = JSON.parse(
  document.getElementById("initial-response")!.textContent!
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoRender.App config={config} initialResponse={initialResponse} />
  </React.StrictMode>
);
