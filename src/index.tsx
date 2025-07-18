import "./styles/index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import Loader from "./UI/Loader/Loader";
import { Html5Qrcode } from "html5-qrcode";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div id="root">{!loading && <App />}</div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
);
