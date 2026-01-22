import placement from "./views/placement.js";
import netGame from "./modes/netMode.js";
import setupLocalGame from "./modes/aiMode.js";
import server from "./modes/serverMode.js";
import matchMode from "./modes/matchMode.js";
import { enableSecretMenu, placementAutomation } from "./automation.js";
import translator from "./translation.js";

function simpleGame(document, settings, useAi, trans) {
    const myField = placement(document, trans);
    const waitForField = async () => {
        const initObj = await myField.ready();
        return setupLocalGame(document, initObj, settings, useAi);
    };
    const battlePromise = waitForField();

    function getBattle() {
        return battlePromise;
    }
    return {myField, getBattle};
}

function automation(window, document, game) {
    enableSecretMenu(window, document, game);
    placementAutomation(game);
}

function startGame(window, document, settings) {
    const mode = settings.mode;
    let game;
    const trans = translator(settings.lang);
    switch (mode) {
    case "ai":
        game = simpleGame(document, settings, true, trans);
        automation(window, document, game);
        break;
    case "net":
        game = netGame(window, document, settings, trans);
        automation(window, document, game);
        break;
    case "server":
        server(window, document, settings);
        break;
    case "hotseat":
        game = simpleGame(document, settings, false, trans);
        placementAutomation(game);
        break;
    case "match":
        matchMode(window, document, settings, trans);
        break;
    }
}

export {startGame};
