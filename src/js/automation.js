import {generateAiField, ai} from "./ai.js";
import {delay} from "./utils/timer.js";

function findPlaceToShip(field, len) {
    let start = -1;
    for (let i = 0; i < field.length; i++) {
        if (field[i] === 1) {
            if (start < 0) {
                start = i;
            }
        }
        if (field[i] === 0) {
            if (start >= 0) {
                if (i - start === len) {
                    return start;
                }
            }
            start = -1;
        }
    }
    if (field.length - start === len) {
        return start;
    }
    return -1;
}

function fillZeroes(field, putTo, length) {
    for (let i = putTo; i < putTo + length + 1; i++) {
        field[i] = 0;
    }
}

async function placeShips(p, field) {
    const ships = p.ships;
    for (const shipsKey of ships) {
        p.choose(shipsKey, 0);
        await delay(500);
        const putTo = findPlaceToShip(field, shipsKey.length);
        const res = p.putShip(putTo);
        if (res) {
            fillZeroes(field, putTo, shipsKey.length);
        } else {
            console.log(field, putTo, shipsKey.length);
        }
        await delay(200);
    }
}


export function setupGameover(g, document) {
    g.on("gameover", () => {
        const btnAdd = document.querySelector(".butInstall");
        if (btnAdd) {
            btnAdd.classList.remove("hidden2");
        }
    });
}

function clickCounterEl(el, codes) {
    let clickCount = 0;
    let curIndex = 0;

    const secretClickHandler = (e) => {
        e.preventDefault();
        if (curIndex >= codes.length) {
            return;
        }
        ++clickCount;
        const {clicks, launch} = codes[curIndex];
        if (clickCount < clicks) {
            return;
        }

        ++curIndex;
        return launch();
    };
    el.addEventListener("click", secretClickHandler);
}

export function clickCounter(document, selector, codes) {
    const secretCodeElem = document.querySelector(selector);
    clickCounterEl(secretCodeElem, codes);
}

export function makePlayerAi(g) {
    const aiBot = ai(g.size());
    function onAiMove1(verdict) {
        const n = aiBot.guess(verdict);
        setTimeout(() => {
            g.firePlayer(n);
        }, 700);
    }

    g.on("meMove", onAiMove1);
    g.on("playerMove", (n) => {
        console.log("Player move " + n);
        aiBot.setLastMove(n);
    });
    if (!g.isEnemyMove()) {
        onAiMove1();
    }
    return g;
}

export function makeEnemyAi(g) {
    const aiBot = ai(g.size());
    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);
    }

    g.on("aiMove", onAiMove);
    g.on("enemyMove", (n) => aiBot.setLastMove(n));
    if (g.isEnemyMove()) {
        onAiMove();
    }
    return g;
}

function playerAi(game) {
    return game.getBattle().then(makePlayerAi);
}

export function enableSecretMenu(window, document, game) {
    const codes = [
        {
            clicks: 3,
            launch: () => playerAi(game)
        },
        {
            clicks: 10,
            launch: () => {
                window.location.href = "https://asavan.github.io/";
            }
        }
    ]
    clickCounter(document, ".secret-code2", codes);
}

export function placementAutomation(game) {
    const codes = [
        {
            clicks: 3,
            launch: () => {
                const field = generateAiField(-1);
                return placeShips(game.myField, field);
            }
        },
        {
            clicks: 6,
            launch: () => playerAi(game)
        }
    ]

    clickCounter(document, ".secret-code", codes);
}
