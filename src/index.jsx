import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

const rootElement = document.getElementById("root");
if (rootElement) {
    const baseUrl = import.meta.env.BASE_URL;
    rootElement.style.setProperty("--card-buffalo-url", `url(${baseUrl}card_buffalo.png)`);
    rootElement.style.setProperty("--card-url", `url(${baseUrl}card.png)`);
    rootElement.style.setProperty("--bg-url", `url(${baseUrl}bg.jpg)`);
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
