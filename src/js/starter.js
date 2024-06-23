import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import server from "./serverMode.js";
import { enableSecretMenu, placementAutomation, makeEnemyAi, setupGameover } from "./automation.js";

function simpleGame(document, settings, useAi) {
    const myField = placement(document);
    const battlePromise = new Promise((resolve) => {
        myField.myFieldPromise.then(
            (initObj) => {
                const g = aiActions(document, initObj, settings);
                if (useAi) {
                    makeEnemyAi(g);
                } else {
                    g.enableHotSeat();
                }
                setupGameover(g, document);
                resolve(g);
            });
    });

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
    switch (mode) {
    case "ai":
        game = simpleGame(document, settings, true);
        automation(window, document, game);
        break;
    case "net":
        game = netGame(window, document, settings);
        automation(window, document, game);
        break;
    case "server":
        game = server(window, document, settings);
        break;
    case "hostseat":
        game = simpleGame(document, settings, false);
        break;
    }
    return game;
}

export {startGame};
