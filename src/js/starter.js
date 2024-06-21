"use strict";

import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import server from "./serverMode.js";
import {defer} from "./helper.js";
import {enableSecretMenu, placementAutomation} from "./automation.js";

function simpleAiGame(window, document, settings) {
    const myField = placement(document);
    const battlePromise = defer();
    myField.myFieldPromise.then(
        (initObj) => {
            const g = aiActions(window, document, initObj.field, initObj, settings);
            battlePromise.resolve(g);
        });

    function getBattle() {
        return battlePromise;
    }
    return {myField, getBattle};
}

function automationAndInstall(window, document, game) {
    enableSecretMenu(window, document, game);
    if (game && game.myField) {
        placementAutomation(game.myField, game);
    }

    try {
        game.getBattle().then(g => {
            g.on("gameover", () => {
                const btnAdd = document.querySelector(".butInstall");
                btnAdd.classList.remove("hidden2");
            });
        });

    } catch (e) {
        console.log(e);
    }
}

function startGame(window, document, settings, urlParams) {
    const mode = settings.mode;
    let game = null;
    switch (mode) {
    case "ai":
        game = simpleAiGame(window, document, settings);
        automationAndInstall(window, document, game);
        break;
    case "net":
        game = netGame(window, document, settings, urlParams);
        automationAndInstall(window, document, game);
        break;
    case "server":
        game = server(window, document, settings);
        break;
    case "hostseat":
        // game = netGame().getBattle();
        game = simpleAiGame(window, document, settings);
        game.getBattle().then(g => g.enableHotSeat());
        break;
    }
    return game;
}

export {startGame};
