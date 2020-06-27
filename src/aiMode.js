import {ai} from "./ai";
import battle from "./battle";
import {VERDICT} from "./core";

export default function aiActions(field, initObj, color) {
    if (initObj) {
        initObj.onOpponentReady();
    }
    const aiBot = ai(field.length, -1);
    const gameColor = color || 'blue';
    const g = battle(document, window, field, aiBot.getFieldEnemy(), gameColor);

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        // console.log("ai move " + n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);
    }

    g.on('aiMove', onAiMove);
    onAiMove(VERDICT.MISS);
    return g;
}
