import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import "./index.css";
import { Html5Qrcode } from "html5-qrcode";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <ConfigProvider locale={ruRU}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConfigProvider>
);
