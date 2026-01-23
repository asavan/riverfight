"use strict";

import { getVerdict, VERDICT, applyBothSides, isEnemyStartFirst } from "../core.js";
import { move, width, createField, printLetterByLetter } from "./helper.js";
import {assert, handlersFunc} from "netutils";
import translator from "../translation.js";


function getEnemyRiver(grid, document, translator) {
    const enemyFieldHtml = createField(grid, document, translator);
    enemyFieldHtml.classList.add("adjust-second");
    return enemyFieldHtml.querySelector(".river");
}

function putDotHtml(n, isEnemy, fieldEnemy, myEnemyField, river, document) {
    const res = fieldEnemy[n];
    myEnemyField[n] = res;
    const verdict = getVerdict(fieldEnemy, myEnemyField, n);
    myEnemyField[n] = verdict;
    let t;
    if (res) {
        t = document.querySelector("#ship-template");
    } else {
        t = document.querySelector("#dot-template2");
    }
    const f = t.content.cloneNode(true);
    const dot = f.firstElementChild;
    if (res) {
        if (isEnemy) {
            dot.classList.add("diagonal-line-enemy");
        } else {
            dot.classList.add("diagonal-line");
        }
    } else {
        if (isEnemy) {
            dot.classList.add("enemy");
        }
    }
    river.appendChild(f);
    // dot.style.left = (n * width + (width - 10) / 2) + 'px';
    dot.style.left = (n * width) + "px";
    dot.style.width = width + "px";
    return {html: dot, res: res, verdict: verdict};
}

function putDotHtml3(n, target, document) {
    return putDotHtml(n,
        target.isOpponentEnemy,
        target.realField,
        target.guessedField,
        target.htmlRiver,
        document
    );
}

function putDotHtml2(n, river, isEnemy, document) {
    const t = document.querySelector("#dot-template");
    const f = t.content.cloneNode(true);
    const dot = f.firstElementChild;
    if (isEnemy) {
        dot.classList.add("enemy");
    }
    river.appendChild(f);
    dot.style.left = (n * width) + "px";
    dot.style.width = width + "px";
}

const playSound = (elem) => {
    if (!elem) {
        return;
    }
    elem.play();
};

const firstMessage = async function (isEnemyPlayer, translator) {
    let append;
    if (isEnemyPlayer) {
        append = await translator.t("prepare");
    } else {
        append = await translator.t("move");
    }
    const msg = await translator.t("begin");
    return msg + append;
};

function verdictToMessage(verdict, isEnemyPlayer, translator) {
    if (verdict === VERDICT.HIT) {
        return translator.t("hit");
    }

    if (verdict === VERDICT.KILL) {
        return translator.t("kill");
    }

    if (verdict === VERDICT.MISS) {
        return translator.t("miss");
    }
    if (verdict === VERDICT.WIN) {
        return isEnemyPlayer ? translator.t("lost") : translator.t("win");
    }
}

async function verdictToMessageExcl(verdict, isEnemyPlayer, translator) {
    const msg = await verdictToMessage(verdict, isEnemyPlayer, translator);
    return msg + "!";
}

function adjustInput(n, maxLen) {
    if (n > maxLen) {
        return maxLen;
    } else if (n < 0) {
        return 0;
    }
    return n;
}

async function showEndMessage(messagePromise, subMsgPromise, document) {
    const overlay = document.querySelector(".overlay");
    const close = document.querySelector(".close");

    close.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.remove("show");
    }, false);

    const h2 = overlay.querySelector("h2");
    const message = await messagePromise;
    h2.textContent = message;
    const content = overlay.querySelector(".content");
    const subMsg = await subMsgPromise;
    content.textContent = subMsg;
    overlay.classList.add("show");
}

export default function battle(document, field, fieldEnemy, settings) {
    assert(field.length === fieldEnemy.length, "Bad size");

    const trans = translator();

    let isEnemyPlayer = isEnemyStartFirst(settings.color);
    console.log("game begin!", {isEnemyPlayer});

    printLetterByLetter(firstMessage(isEnemyPlayer, trans), 70, isEnemyPlayer, 100000, document);
    const handlers = handlersFunc([
        "playerMove",
        "enemyMove",
        "meMove",
        "aiMove",
        "gameover"
    ]);

    const on = handlers.on;
    const onEnemyMove = handlers.handler("aiMove");
    const onMeMove = handlers.handler("meMove");

    const grid = document.querySelector(".grid");
    const river = getEnemyRiver(grid, document, trans);
    const myRiver = document.querySelector(".river");
    const bloop = document.getElementById("bloop");

    function loose(translator) {
        handlers.call("gameover", false);
        showEndMessage(translator.t("loose2"), translator.t("next"), document);
    }

    function victory(translator) {
        handlers.call("gameover", true);
        if (settings.useSound) {
            const tada = document.getElementById("tada");
            playSound(tada);
        }
        showEndMessage(translator.t("win"), translator.t("good"), document);
    }

    function onKill(target, n) {
        applyBothSides(target.guessedField, n, (ind) => {
            putDotHtml2(ind, target.htmlRiver, target.isOpponentEnemy, document);
        });
        if (settings.useSound && !target.isOpponentEnemy) {
            playSound(bloop);
        }
    }

    const player = {
        realField: field,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: myRiver,
        onOpponentMiss: onMeMove,
        onOpponentHit: onEnemyMove,
        isOpponentEnemy: true
    };

    const enemy = {
        realField: fieldEnemy,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: river,
        onOpponentMiss: onEnemyMove,
        onOpponentHit: onMeMove,
        isOpponentEnemy: false
    };

    function fire(n) {
        const target = isEnemyPlayer ? player : enemy;
        const {verdict} = putDotHtml3(n, target, document);
        const messagePromise = verdictToMessageExcl(verdict, target.isOpponentEnemy, trans);
        printLetterByLetter(messagePromise, 70, target.isOpponentEnemy, 100000, document);

        if (verdict === VERDICT.MISS) {
            isEnemyPlayer = !isEnemyPlayer;
            target.onOpponentMiss(verdict);
        } else if (verdict === VERDICT.WIN) {
            if (!target.isOpponentEnemy) {
                victory(trans);
            } else {
                loose(trans);
            }
        } else {
            target.onOpponentHit(verdict);
            if (verdict === VERDICT.KILL) {
                onKill(target, n);
            }
        }
    }

    function fireEnemy(n) {
        if (!isEnemyPlayer) {
            return;
        }
        n = adjustInput(n, field.length - 1);
        handlers.call("enemyMove", n);
        fire(n);
    }

    function firePlayer(n) {
        if (isEnemyPlayer) {
            return;
        }
        n = adjustInput(n, field.length - 1);
        handlers.call("playerMove", n);
        fire(n);
    }

    function clickHandlerMy(e) {
        move(e, firePlayer);
    }

    function clickHandlerEnemy(e) {
        move(e, fireEnemy);
    }

    function enableHotSeat() {
        myRiver.addEventListener("click", clickHandlerEnemy);
    }

    river.addEventListener("click", clickHandlerMy);
    const size = () => field.length;
    const isEnemyMove = () => isEnemyPlayer;
    return {
        size,
        fireEnemy,
        firePlayer,
        on,
        enableHotSeat,
        isEnemyMove
    };
}
