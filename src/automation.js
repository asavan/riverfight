import {generateAiField} from "./ai.js";
import {delay} from "./helper.js";

function findPlaceToShip(field, len) {
    let start = -1;
    let end = -1;
    for (let i = 0; i < field.length; i++) {
        if (field[i] === 1) {
            if (start < 0) {
                start = i;
            }
            end = -1;
        }
        if (field[i] === 0) {
            if (end < 0) {
                end = i;
                if (start >= 0) {
                    if (end - start === len) {
                        return start;
                    }
                }
                start = -1;
            } else {
                end = -1;
                start = -1;
            }
        }
    }
    return start;
}

function fillZeroes(field, putTo, length) {
    for (let i = putTo; i < putTo + length + 1; i++) {
        field[i] = 0;
    }
}

export function placementAutomation(p) {
    const secretCodeElem = document.querySelector(".secret-code");

    let clickCount = 0;
    const field = generateAiField(-1);

    const secretClickHandler = async function (e) {
        ++clickCount;
        if (clickCount >= 3) {
            clickCount = 0;
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
    }
    secretCodeElem.addEventListener("click", secretClickHandler);
}
