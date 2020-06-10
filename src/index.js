import "./css/style.css";

import init from "./init";
import game from "./game";
import {ai, generateAiField} from "./ai";

function onReady(field) {
    console.log(field);
    const aiBot = ai(field.length, -1);
    const g = game(document, window, field, aiBot.getFieldEnemy(), onAiMove);
    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        console.log(n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);

    }

}

function fake() {
    onReady(generateAiField(1));
}

init(document, window, onReady);
// fake();

if (__USE_SERVICE_WORKERS__) {
    console.log("Service workers!");
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js',  {scope: './'});
    }
}
