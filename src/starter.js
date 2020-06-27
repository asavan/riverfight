import placement from "./placement.js";
import aiActions from "./aiMode.js";
import netGame from "./netMode.js";
import fake from "./fakeMode.js";

function startGame(mode) {
    let game;
    switch (mode) {
        case "ai":
            placement(document).then((initObj) => {
                aiActions(initObj.field, initObj, 'blue');
            });
            break;
        case "fake":
            fake();
            break;
        case "net":
            game = netGame();
            break;
    }
    return game;
}

export {startGame};
