"use strict";

import settings from "./js/settings.js";
import {startGame} from "./js/starter.js";
import install from "./js/install_as_app.js";
import {launch, parseSettings} from "./js/helper.js";

function starter(window, document) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    parseSettings(window, document, settings);
    startGame(window, document, settings, urlParams);
}

starter(window, document);

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
        install(window, document);
    }
}
