import React from "react";
import ReactDOM from "react-dom/client";
import * as Djream from "@djream/core";
import "./index.css";

import HomeView from "./views/Home";

// Add your views here
const djreamConfig = new Djream.Config();
djreamConfig.addView("Home", HomeView);

const rootElement = document.getElementById("root")!;
const initialResponse = rootElement.dataset.initialResponse!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Djream.App config={djreamConfig} initialResponse={JSON.parse(initialResponse)} />
  </React.StrictMode>
);
