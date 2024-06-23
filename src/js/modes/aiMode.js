import { generateAiField } from "../ai.js";
import onGameReady from "./common.js";
import { makeEnemyAi, setupGameover } from "../automation.js";

export default function setupLocalGame(document, initObj, settings, useAi) {
    const g = onGameReady(document, initObj, generateAiField(-1), settings);
    if (useAi) {
        makeEnemyAi(g);
    } else {
        g.enableHotSeat();
    }
    setupGameover(g, document);
    return g;
}
