import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { i18nSetup } from "./i18n/i18n.setup.ts";
import Providers from "./providers/providers.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.pcss";

i18nSetup();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
