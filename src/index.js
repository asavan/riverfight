import "./css/style.css";

import settings from "./settings.js";
import {startGame} from "./starter.js";
import install from "./install_as_app";
import {launch} from "./helper";

function starter(window, document) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    settings.currentMode = urlParams.get('currentMode') || settings.currentMode;
    startGame(window, document, settings);
}

launch(window, document, starter);

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
        install(window, document);
    }
}
