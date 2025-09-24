"use strict";

import settings from "./js/settings.js";
import { startGame } from "./js/starter.js";
import { install, parseSettings } from "netutils";

function starter(window, document) {
    parseSettings(window.location.search, settings);
    startGame(window, document, settings);
}

starter(window, document);


if (__USE_SERVICE_WORKERS__) {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", {scope: "./"});
        install(window, document);
    }
}
