import "./css/style.css";

import init from "./init";
import game from "./game";
import ai from "./ai";

const fieldEx = [1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];


function onReady(field) {
    console.log(field);
    const aiBot = ai(field.length);
    const g = game(document, window, field, aiBot.getFieldEnemy(), onAiMove);
    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        console.log(n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 500);

    }

}

// init(document, window, onReady);

onReady(fieldEx);
