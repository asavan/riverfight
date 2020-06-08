import "./css/style.css";

import init from "./init";
import game from "./game";

const fieldEx = [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];

function onReady(field) {
    let str = "";
    for (let i = 0; i < field.length; i++) {
        str += field[i] + " ";
    }
    console.log(str);
    game(document, window, field);
}

init(document, window, onReady);

// onReady(fieldEx);
