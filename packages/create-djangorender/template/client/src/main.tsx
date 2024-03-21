import React from "react";
import ReactDOM from "react-dom/client";
import * as DjangoRender from "@djangorender/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const djangorenderConfig = new DjangoRender.Config();
djangorenderConfig.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = rootElement.dataset.initialResponse!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoRender.App
      config={djangorenderConfig}
      initialResponse={JSON.parse(initialResponse)}
    />
  </React.StrictMode>
);
