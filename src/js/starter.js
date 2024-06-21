import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import server from "./serverMode.js";
import {enableSecretMenu, placementAutomation} from "./automation.js";

function simpleAiGame(window, document, settings) {
    const myField = placement(document);
    const battlePromise = new Promise((resolve) => {
        myField.myFieldPromise.then(
            (initObj) => {
                const g = aiActions(window, document, initObj, settings);
                resolve(g);
            });
    });

    function getBattle() {
        return battlePromise;
    }
    return {myField, getBattle};
}

function automationAndInstall(window, document, game) {
    enableSecretMenu(window, document, game);
    placementAutomation(game);
    game.getBattle().then(g => {
        g.on("gameover", () => {
            const btnAdd = document.querySelector(".butInstall");
            if (btnAdd) {
                btnAdd.classList.remove("hidden2");
            }
        });
    });
}

function startGame(window, document, settings) {
    const mode = settings.mode;
    let game;
    switch (mode) {
    case "ai":
        game = simpleAiGame(window, document, settings);
        automationAndInstall(window, document, game);
        break;
    case "net":
        game = netGame(window, document, settings);
        automationAndInstall(window, document, game);
        break;
    case "server":
        game = server(window, document, settings);
        break;
    case "hostseat":
        game = simpleAiGame(window, document, settings);
        game.getBattle().then(g => g.enableHotSeat());
        break;
    }
    return game;
}

export {startGame};
