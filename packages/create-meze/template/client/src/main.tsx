import React from "react";
import ReactDOM from "react-dom/client";
import * as Meze from "@meze/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const mezeConfig = new Meze.Config();
mezeConfig.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = rootElement.dataset.initialResponse!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Meze.App
      config={mezeConfig}
      initialResponse={JSON.parse(initialResponse)}
    />
  </React.StrictMode>
);
