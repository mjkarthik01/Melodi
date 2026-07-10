"use client";

import { BrowserRouter } from "react-router-dom";
import App from "../src/App";
import ScrollToTop from "../src/components/ScrollToTop";
import { AppProviders } from "./AppProviders";

export default function ReactAppBridge() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </AppProviders>
  );
}
