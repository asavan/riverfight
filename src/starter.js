import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import fake from "./fakeMode.js";
import server from "./serverMode.js";
import {defer} from "./helper.js";
import {enableSecretMenu, placementAutomation} from "./automation.js";

function simpleAiGame(window, document) {
    const myField = placement(document);
    const battlePromise = defer();
    myField.myFieldPromise.then(
        (initObj) => {
            const g = aiActions(initObj.field, initObj, 'blue');
            battlePromise.resolve(g);
        });

    function getBattle() {
        return battlePromise;
    }
    return {myField, getBattle};
}

function automationAndInstall(game, document) {
    enableSecretMenu(game);
    if (game && game.myField) {
        placementAutomation(game.myField, game);
    }

    try {
        game.getBattle().then(g => {
            g.on("gameover", (res) => {
                const btnAdd = document.querySelector('.butInstall');
                btnAdd.classList.remove("hidden2");
            });
        });

    } catch (e) {
        console.log(e);
    }
}

function startGame(window, document, settings) {
    const mode = settings.currentMode;
    let game = null;
    switch (mode) {
        case "ai":
            game = simpleAiGame(window, document);
            automationAndInstall(game, document);
            break;
        case "fake":
            fake();
            break;
        case "net":
            game = netGame(window, document, settings);
            automationAndInstall(game, document);
            break;
        case "server":
            game = server(window, document, settings);
            break;
        case "hostseat":
            // game = netGame().getBattle();
            game = simpleAiGame(window, document);
            game.getBattle().then(g => g.enableHotSeat());
            break;
    }
    return game;
}

export {startGame};
