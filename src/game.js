export default function game(document, window, field, fieldEnemy, onEnemyMove) {
    const width = 20;
    const grid = document.querySelector(".grid");
    let currentPlayer = 0;
    const myEnemyField = new Array(field.length).fill(0);
    const enemyMyField = new Array(field.length).fill(0);

    const t = document.querySelector('#field-template');
    const f = t.content.cloneNode(true);
    const enemyFieldHtml = f.firstElementChild;
    grid.appendChild(f).firstElementChild;
    enemyFieldHtml.classList.add("adjust-second");
    const river = enemyFieldHtml.querySelector(".river");

    const VERDICT = {
        HIT: 1,
        KILL: 2,
        WIN: 3,
        MISS: 4
    }

    function verdictToMessage(verdict) {
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
            return "Победа";
        }
    }

    function getLen(field, n) {
        let shipLen = 1;
        let i = n + 1;
        while (i < field.length) {
            if (field[i]) {
                ++shipLen;
            } else {
                break;
            }
            ++i;
        }

        i = n - 1;
        while (i >= 0) {
            if (field[i]) {
                ++shipLen;
            } else {
                break;
            }
            --i;
        }
        return shipLen;
    }

    function isSame(fieldEnemy, myEnemyField, n) {
        for (let i = 0; i < fieldEnemy.length; i++) {
            if (i === n) {
                continue;
            }
            if (fieldEnemy[i] !== myEnemyField[i]) {
                return false;
            }
        }
        return true;
    }

    function getVerdict(fieldEnemy, myEnemyField, n) {
        let res = fieldEnemy[n];
        if (!res) {
            return VERDICT.MISS;
        }
        const enemyLen = getLen(fieldEnemy, n);
        const myEnemyLen = getLen(myEnemyField, n);
        if (myEnemyLen === enemyLen) {
            if (isSame(fieldEnemy, myEnemyField, n)) {
                return VERDICT.WIN;
            }
            return VERDICT.KILL;
        } else if (myEnemyLen < enemyLen) {
            return VERDICT.HIT;
        }

        throw "Illegal state";
    }

    function putDotHtml(n, isEnemy, fieldEnemy, myEnemyField, river) {
        let t;
        let res = fieldEnemy[n];
        myEnemyField[n] = res;
        const verdict = getVerdict(fieldEnemy, myEnemyField, n);
        if (res) {
            t = document.querySelector('#ship-template');
        } else {
            t = document.querySelector('#dot-template2');
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

    const myRiver = document.querySelector(".river");
    river.addEventListener("click", clickHandlerMy);
    let printingInterval = null;

    function printLetterByLetter(message, speed) {
        let i = 0;
        const messageAnchor = document.querySelector('.message');
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

    function clickHandlerMy(e) {
        if (currentPlayer !== 0) {
            return;
        }
        const n = Math.floor((e.offsetX + 1) / width);
        const res = putDotHtml(n, false, fieldEnemy, myEnemyField, river);
        const message = verdictToMessage(res.verdict) + "!";
        printLetterByLetter(message, 50);
        console.log(message);

        if (res.verdict === VERDICT.MISS) {
            currentPlayer = 1;
            onEnemyMove();
        } else if (res.verdict === VERDICT.WIN) {
            victory();
        }
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


    function clickHandlerEnemy(e) {
        if (currentPlayer !== 1) {
            return;
        }
        const n = Math.floor((e.offsetX + 1) / width);
        const res = putDotHtml(n, true, field, enemyMyField, myRiver);
        console.log(verdictToMessage(res.verdict));
        if (res.verdict === VERDICT.MISS) {
            currentPlayer = 0;
            // onMyMove();
        } else if (res.verdict === VERDICT.WIN) {
            loose();
        }
    }

    myRiver.addEventListener("click", clickHandlerEnemy);

    // putDotHtml(0);
}
