import React from "react";
import ReactDOM from "react-dom/client";
import * as DjangoRender from "@djrender/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const djrenderConfig = new DjangoRender.Config();
djrenderConfig.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = rootElement.dataset.initialResponse!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DjangoRender.App
      config={djrenderConfig}
      initialResponse={JSON.parse(initialResponse)}
    />
  </React.StrictMode>
);
