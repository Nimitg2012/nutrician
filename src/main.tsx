import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "@/components/providers";
import { WebsiteEffects } from "@/components/website";
import { AppRoutes } from "@/spa-routes";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <WebsiteEffects />
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  </StrictMode>,
);
