import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./shared/styles/main.scss";

document.documentElement.lang = "he";
document.documentElement.dir = "rtl";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
