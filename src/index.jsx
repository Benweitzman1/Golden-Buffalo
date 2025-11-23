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

    // Fullscreen helper functions
    window.requestFullscreenGame = () => {
        const doc = document.documentElement;

        // Standard fullscreen API (try first for better compatibility)
        if (doc.requestFullscreen) {
            return doc.requestFullscreen().catch(() => {
                // Fall through to other methods
            });
        }
        // iOS Safari and mobile browsers
        else if (doc.webkitRequestFullscreen) {
            return doc.webkitRequestFullscreen();
        } else if (doc.webkitEnterFullscreen) {
            return doc.webkitEnterFullscreen();
        }
        // MS Edge
        else if (doc.msRequestFullscreen) {
            return doc.msRequestFullscreen();
        }
        // Firefox
        else if (doc.mozRequestFullScreen) {
            return doc.mozRequestFullScreen();
        }
        // iOS Safari workaround - hide address bar by scrolling
        else {
            window.scrollTo(0, 1);
            setTimeout(() => window.scrollTo(0, 0), 0);
        }
    };

    window.exitFullscreenGame = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };

    window.isFullscreen = () => {
        return !!(
            (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.webkitCurrentFullScreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                window.navigator.standalone === true
            ) // iOS standalone mode
        );
    };
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>
);
