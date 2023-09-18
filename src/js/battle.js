"use strict";

import {getVerdict, VERDICT, applyBothSides, isEnemyStartFirst} from "./core.js";
import {move, width, getTemplateByName, createField, printLetterByLetter} from "./helper.js";


function getEmemyRiver(grid) {
    const enemyFieldHtml = createField(grid);
    enemyFieldHtml.classList.add("adjust-second");
    return enemyFieldHtml.querySelector(".river");
}

function stub() {}

function putDotHtml(n, isEnemy, fieldEnemy, myEnemyField, river) {
    let res = fieldEnemy[n];
    myEnemyField[n] = res;
    const verdict = getVerdict(fieldEnemy, myEnemyField, n);
    myEnemyField[n] = verdict;
    let t;
    if (res) {
        t = getTemplateByName("#ship-template");
    } else {
        t = getTemplateByName("#dot-template2");
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

function putDotHtml2(n, river, isEnemy) {
    let t = getTemplateByName("#dot-template");
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
    if (!elem) return;
    elem.play();
};

const firstMessage = function (isEnemyPlayer) {
    let append;
    if (isEnemyPlayer) {
        append = "Сейчас прилетит!";
    } else {
        append = "Ходи!";
    }
    return "Игра началась. " + append;
};

function verdictToMessage(verdict, isEnemyPlayer) {
    if (verdict === VERDICT.HIT) {
        return "Ранил";
    }

    if (verdict === VERDICT.KILL) {
        return "Убил";
    }

    if (verdict === VERDICT.MISS) {
        return "Мимо";
    }
    if (verdict === VERDICT.WIN) {
        return isEnemyPlayer ? "Потрачено" : "Победа";
    }
}


export default function battle(document, window, field, fieldEnemy, settings) {
    console.log("game begin!");
    let color = settings.color;
    let isEnemyPlayer = isEnemyStartFirst(color);

    printLetterByLetter(firstMessage(isEnemyPlayer), 70, isEnemyPlayer, 100000);
    const handlers = {
        "playerMove": stub,
        "enemyMove": stub,
        "meMove": stub,
        "aiMove": stub,
        "gameover": stub
    };

    function showEndMessage(message, subMsg) {
        const overlay = document.getElementsByClassName("overlay")[0];
        const close = document.getElementsByClassName("close")[0];

        close.addEventListener("click", function (e) {
            e.preventDefault();
            overlay.classList.remove("show");
        }, false);


        const h2 = overlay.querySelectorAll("h2")[0];
        h2.textContent = message;
        const content = overlay.querySelectorAll(".content")[0];
        content.textContent = "";
        if (subMsg) {
            content.textContent = subMsg;
        }
        overlay.classList.add("show");
    }


    function loose() {
        handlers["gameover"](false);
        showEndMessage("Ты проиграл", "В другой раз повезет");
    }

    function victory() {
        handlers["gameover"](true);
        showEndMessage("Победа", "А ты хорош!");
    }


    function on(name, f) {
        handlers[name] = f;
    }

    function onEnemyMove(param) {
        return handlers["aiMove"](param);
    }

    function onMeMove(param) {
        return handlers["meMove"](param);
    }

    const grid = document.querySelector(".grid");
    const river = getEmemyRiver(grid);
    const myRiver = document.querySelector(".river");
    const bloop = document.getElementById("bloop");
    const tada = document.getElementById("tada");

    const player = {
        realField: field,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: myRiver,
        onOpponentMiss: onMeMove,
        onOpponentHit: onEnemyMove,
        isEnemy: false
    };

    const enemy = {
        realField: fieldEnemy,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: river,
        onOpponentMiss: onEnemyMove,
        onOpponentHit: onMeMove,
        isEnemy: true
    };

    function fire(n) {
        if (n >= field.length) {
            n = field.length - 1;
        } else if (n < 0) {
            n = 0;
        }
        const user = isEnemyPlayer ? player : enemy;
        const res = putDotHtml(n, isEnemyPlayer, user.realField, user.guessedField, user.htmlRiver);
        const message = verdictToMessage(res.verdict, isEnemyPlayer) + "!";
        printLetterByLetter(message, 70, isEnemyPlayer, 100000);

        if (res.verdict === VERDICT.MISS) {
            isEnemyPlayer = !isEnemyPlayer;
            user.onOpponentMiss(res.verdict);
        } else if (res.verdict === VERDICT.WIN) {
            if (!isEnemyPlayer) {
                if (settings.useSound) {
                    playSound(tada);
                }
                victory();
            } else {
                loose();
            }
        } else {
            user.onOpponentHit(res.verdict);
            if (res.verdict === VERDICT.KILL) {
                applyBothSides(user.guessedField, n, (ind) => {
                    putDotHtml2(ind, user.htmlRiver, isEnemyPlayer);
                });
                if (settings.useSound && !isEnemyPlayer) {
                    playSound(bloop);
                }
            }
        }
    }

    function fireEnemy(n) {
        if (!isEnemyPlayer) {
            return;
        }
        handlers["enemyMove"](n);
        fire(n);
    }

    function firePlayer(n) {
        if (isEnemyPlayer) {
            return;
        }
        handlers["playerMove"](n);
        fire(n);
    }

    function clickHandlerMy(e) {
        if (isEnemyPlayer) {
            return;
        }
        move(e, firePlayer);
    }

    function clickHandlerEnemy(e) {
        if (!isEnemyPlayer) {
            return;
        }
        move(e, fireEnemy);
    }

    function enableHotSeat() {
        myRiver.addEventListener("click", clickHandlerEnemy);
    }

    river.addEventListener("click", clickHandlerMy);
    return {
        fireEnemy: fireEnemy,
        firePlayer: firePlayer,
        on: on,
        enableHotSeat: enableHotSeat,
        color: color
    };
}
