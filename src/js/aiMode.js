import { generateAiField } from "./ai.js";
import { makeEnemyAi } from "./automation.js";
import battle from "./battle.js";

export default function aiActions(document, initObj, settings) {
    const field = initObj.field;
    initObj.onOpponentReady();
    const fieldEnemy = generateAiField(-1);
    const g = battle(document, field, fieldEnemy, settings);
    makeEnemyAi(g);
    return g;
}
