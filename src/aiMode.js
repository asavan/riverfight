import {ai, generateAiField} from "./ai.js";
import battle from "./battle.js";
import {VERDICT, isEnemyStartFirst} from "./core.js";

export default function aiActions(window, document, field, initObj, color) {
    if (initObj) {
        initObj.onOpponentReady();
    }
    const fieldEnemy = generateAiField(-1);
    const aiBot = ai(field.length);
    const g = battle(document, window, field, fieldEnemy, color);

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        // console.log("ai move " + n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);
    }

    g.on('aiMove', onAiMove);
    g.on('enemyMove', (n) => aiBot.setLastMove(n));
    if (isEnemyStartFirst(color)) {
        onAiMove(VERDICT.MISS);
    }
    return g;
}
