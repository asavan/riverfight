import {getVerdict, VERDICT, verdictToMessage, applyBothSides} from './core.js';
import {move, width, getTemplateByName, createField, printLetterByLetter} from './helper.js';
import settings from "./settings";


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
        t = getTemplateByName('#ship-template');
    } else {
        t = getTemplateByName('#dot-template2');
    }
    const f = t.content.cloneNode(true);
    const dot = f.firstElementChild;
    if (res) {
        if (isEnemy) {
            dot.classList.add('diagonal-line-enemy');
        } else {
            dot.classList.add('diagonal-line');
        }
    } else {
        if (isEnemy) {
            dot.classList.add('enemy');
        }
    }
    river.appendChild(f);
    // dot.style.left = (n * width + (width - 10) / 2) + 'px';
    dot.style.left = (n * width) + 'px';
    dot.style.width = width + 'px';
    return {html: dot, res: res, verdict: verdict};
}

function putDotHtml2(n, river, isEnemy) {
    let t = getTemplateByName('#dot-template');
    const f = t.content.cloneNode(true);
    const dot = f.firstElementChild;
    if (isEnemy) {
        dot.classList.add('enemy');
    }
    river.appendChild(f);
    dot.style.left = (n * width) + 'px';
    dot.style.width = width + 'px';
}


function loose() {
    setTimeout(() => {
        alert("Ты проиграл");
    }, 700);
}

function victory() {
    setTimeout(() => {
        alert("Победа");
    }, 700);
}

export default function battle(document, window, field, fieldEnemy, color) {
    console.log("game begin!");
    printLetterByLetter("Игра началась", 70, false, 2000);
    const handlers = {
        'playerMove': stub,
        'enemyMove': stub,
        'aiMove': stub
    }

    function on(name, f) {
        handlers[name] = f;
    }

    function onEnemyMove(param) {
        return handlers['aiMove'](param);
    }

    function start() {

    }

    // TODO
    let isEnemyPlayer = color !== 'blue';
    const grid = document.querySelector(".grid");
    const river = getEmemyRiver(grid);
    const myRiver = document.querySelector(".river");

    const player = {
        realField: field,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: myRiver,
        onOpponentMiss: stub,
        onOpponentHit: onEnemyMove,
        isEnemy: false
    };

    const enemy = {
        realField: fieldEnemy,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: river,
        onOpponentMiss: onEnemyMove,
        onOpponentHit: stub,
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
        const message = verdictToMessage(res.verdict) + "!";
        printLetterByLetter(message, 70, isEnemyPlayer, 2000);

        if (res.verdict === VERDICT.MISS) {
            isEnemyPlayer = !isEnemyPlayer;
            user.onOpponentMiss(res.verdict);
        } else if (res.verdict === VERDICT.WIN) {
            if (!isEnemyPlayer) {
                victory();
            } else {
                loose();
            }
        } else {
            user.onOpponentHit(res.verdict);
            if (res.verdict === VERDICT.KILL) {
                applyBothSides(user.guessedField, n, (ind) => {
                    putDotHtml2(ind, user.htmlRiver, isEnemyPlayer)
                });
            }
        }
    }

    function fireEnemy(n) {
        if (!isEnemyPlayer) {
            return;
        }
        fire(n);
        handlers['enemyMove'](n);
    }

    function firePlayer(n) {
        if (isEnemyPlayer) {
            return;
        }
        fire(n);
        handlers['playerMove'](n);
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
        enableHotSeat: enableHotSeat
    }
}
