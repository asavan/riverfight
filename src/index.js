import "./css/style.css";

import settings from "./settings.js";
import {startGame} from "./starter.js";
import {placementAutomation} from "./automation.js";

const game = startGame(settings.currentMode);
if (game && game.myField) {
    placementAutomation(game.myField);
}

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
    }
}
