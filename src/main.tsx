import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import { AppRoutes } from "./routes";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages (npm run build:prerender) ship HTML in #root and are hydrated;
// the default SPA build ships an empty #root and renders on the client.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
