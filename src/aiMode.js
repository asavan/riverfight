import {ai, generateAiField} from "./ai";
import battle from "./battle";
import {VERDICT} from "./core";

export default function aiActions(field, initObj, color) {
    if (initObj) {
        initObj.onOpponentReady();
    }
    const fieldEnemy = generateAiField(-1);
    const aiBot = ai(field.length);
    const gameColor = color || 'blue';
    const g = battle(document, window, field, fieldEnemy, gameColor);

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        // console.log("ai move " + n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);
    }

    g.on('aiMove', onAiMove);
    g.on('enemyMove', (n) => aiBot.setLastMove(n));
    if (color === 'red') {
        onAiMove(VERDICT.MISS);
    }
    return g;
}
