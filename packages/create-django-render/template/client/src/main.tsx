import React from "react";
import ReactDOM from "react-dom/client";
import * as DjangoRender from "@django-render/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const djangoRenderConfig = new DjangoRender.Config();
djangoRenderConfig.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = rootElement.dataset.initialResponse!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoRender.App
      config={djangoRenderConfig}
      initialResponse={JSON.parse(initialResponse)}
    />
  </React.StrictMode>
);
