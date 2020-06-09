import {getVerdict, VERDICT, verdictToMessage, applyBothSides} from './core.js';
import {move, width, getTemplateByName, createField} from './helper.js';

function getEmemyRiver(grid) {
    const enemyFieldHtml = createField(grid);
    enemyFieldHtml.classList.add("adjust-second");
    return enemyFieldHtml.querySelector(".river");
}

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

export default function game(document, window, field, fieldEnemy, onEnemyMove) {
    let isEnemyPlayer = false;
    const grid = document.querySelector(".grid");
    const river = getEmemyRiver(grid);
    const myRiver = document.querySelector(".river");

    const player = {
        realField : field,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: myRiver,
        onOpponentMiss:  () => { console.log("player hit");},
        onOpponentHit: onEnemyMove,
        isEnemy: false
    };

    const enemy = {
        realField : fieldEnemy,
        guessedField: new Array(field.length).fill(VERDICT.NONE),
        htmlRiver: river,
        onOpponentMiss: onEnemyMove,
        onOpponentHit: () => { console.log("player hit");},
        isEnemy: true
    };

    let printingInterval = null;

    function printLetterByLetter(message, speed, isEnemyPlayer) {
        let i = 0;
        const messageAnchor = document.querySelector('.message');
        if (isEnemyPlayer) {
            messageAnchor.classList.add('enemy');
        } else {
            messageAnchor.classList.remove('enemy');
        }
        if (printingInterval) {
            messageAnchor.innerHTML = "";
            clearInterval(printingInterval);
        }
        printingInterval = setInterval(function () {
            messageAnchor.innerHTML += message.charAt(i);
            i++;
            if (i > message.length) {
                clearInterval(printingInterval);
                printingInterval = setTimeout(()=> {messageAnchor.innerHTML = ""}, 2000);
            }
        }, speed);
    }

    function fire(n) {
        const user = isEnemyPlayer ? player : enemy;
        const res = putDotHtml(n, isEnemyPlayer, user.realField, user.guessedField, user.htmlRiver);
        const message = verdictToMessage(res.verdict) + "!";
        printLetterByLetter(message, 70, isEnemyPlayer);
        console.log(message);

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
                applyBothSides(user.guessedField, n,  (ind) => {putDotHtml2(ind, user.htmlRiver, isEnemyPlayer)});
            }
        }
    }

    function fireEnemy(n) {
        if (!isEnemyPlayer) {
            return;
        }
        fire(n);
    }

    function clickHandlerMy(e) {
        if (isEnemyPlayer) {
            return;
        }
        move(e, fire);
    }

    function clickHandlerEnemy(e) {
        if (!isEnemyPlayer) {
            return;
        }
        move(e, fire);
    }

    myRiver.addEventListener("click", clickHandlerEnemy);
    river.addEventListener("click", clickHandlerMy);
    return {
        fireEnemy: fireEnemy
    }

    // putDotHtml(0);
}
