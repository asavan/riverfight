"use strict";

import "./css/style.css";

import settings from "./js/settings.js";
import {startGame} from "./js/starter.js";
import install from "./js/install_as_app.js";
import {launch} from "./js/helper.js";

function starter(window, document) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        settings[key] = value;
    }
    startGame(window, document, settings);
}

launch(window, document, starter);

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
        install(window, document);
    }
}
