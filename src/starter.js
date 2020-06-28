import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import fake from "./fakeMode.js";
import {defer} from "./helper";

function simpleAiGame() {
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

function startGame(mode) {
    let game = null;
    switch (mode) {
        case "ai":
            game = simpleAiGame();
            break;
        case "fake":
            fake();
            break;
        case "net":
            game = netGame();
            break;
        case "hostseat":
            // game = netGame().getBattle();
            game = simpleAiGame();
            game.getBattle().then(g => g.enableHotSeat());
            break;
    }
    return game;
}

export {startGame};
