"use strict";

import {generateAiField, ai} from "./ai.js";
import {delay} from "./utils/timer.js";
import {VERDICT} from "./core.js";

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

export function placementAutomation(game) {
    const secretCodeElem = document.querySelector(".secret-code");

    let clickCount = 0;
    let placementDone = false;
    let aiInited = false;
    const field = generateAiField(-1);

    const secretClickHandler = (e) => {
        e.preventDefault();
        ++clickCount;
        if (clickCount > 3) {
            clickCount = 0;
            if (!placementDone) {
                placementDone = true;
                return placeShips(game.myField, field);
            } else {
                if (!aiInited) {
                    playerAi(game);
                }
                aiInited = true;
            }

        }
    };
    secretCodeElem.addEventListener("click", secretClickHandler);
}


function playerAi(game) {
    return game.getBattle().then(g => {
        const field = generateAiField(-1);
        const aiBot = ai(field.length);

        function onAiMove1(verdict) {
            const n = aiBot.guess(verdict);
            // console.log("ai move " + n);
            setTimeout(() => {
                g.firePlayer(n);
            }, 1000);
        }

        g.on("meMove", onAiMove1);
        g.on("playerMove", (n) => {
            console.log("Player move " + n);
            aiBot.setLastMove(n);
        });
        onAiMove1(VERDICT.MISS);
        return true;
    });
}

export function enableSecretMenu(window, document, game) {
    const secretCodeElem = document.querySelector(".secret-code2");
    let clickCount = 0;
    let aiInited = false;
    const secretClickHandler = (e) => {
        e.preventDefault();
        ++clickCount;
        if (clickCount >= 10) {
            window.location.href = "https://asavan.github.io/";
        }
        if (clickCount > 3) {
            if (aiInited) {
                return;
            }
            aiInited = true;
            playerAi(game);
        }
    };
    secretCodeElem.addEventListener("click", secretClickHandler);
}
