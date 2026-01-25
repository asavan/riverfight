import battle from "../views/battle.js";

export default function onGameReady(document, initObj, fieldEnemy, settings, translator) {
    initObj.onOpponentReady();
    return battle(document, initObj.field, fieldEnemy, settings, translator);
}
