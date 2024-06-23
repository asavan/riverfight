"use strict";

import {VERDICT, applyBothSides, applyToFirstNonNone} from "./core.js";
import { assert } from "./utils/assert.js";

function randomInteger(min, max) {
    const rand = min + Math.random() * (max - min);
    return Math.floor(rand);
}

function randomIndex(len) {
    return randomInteger(0, len);
}

function chooseRandomIndex(field) {
    let noneCount = 0;
    for (let i = 0; i < field.length; i++) {
        if (field[i] === VERDICT.NONE) {
            ++noneCount;
        }
    }
    assert(noneCount > 0, "No empty space");
    return randomIndex(noneCount);
}

function getRandomIndex(field) {
    let index = chooseRandomIndex(field);
    let i = 0;
    for (; i < field.length; i++) {
        if (field[i] === VERDICT.NONE) {
            --index;
        }
        if (index < 0) {
            break;
        }
    }
    assert(i < field.length && i >= 0, "No empty space2");
    return i;
}

function randomDirection() {
    const dir = randomIndex(2);
    if (dir === 0) {
        return -1;
    }
    return 1;
}

export function generateAiField(ind) {
    const fields = [
        [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
        [0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1]
    ];
    if (ind < 0) {
        ind = randomIndex(fields.length);
    }
    return fields[ind];
}

export function ai(len) {
    const field = new Array(len).fill(VERDICT.NONE);
    let lastMove = -1;
    let prevDirection = 0;
    let prevIndex = -1;

    function guess(field, currVerdict) {
        if (lastMove < 0) {
            return getRandomIndex(field);
        }
        assert(lastMove < field.length, "In bounds");

        field[lastMove] = currVerdict;
        if (currVerdict === VERDICT.HIT) {
            if (prevDirection === 0) {
                prevDirection = randomDirection();
            }

            let ind = -1;
            applyToFirstNonNone(field, lastMove, prevDirection, (j) => {
                ind = j;
            });
            if (ind >= 0) {
                return ind;
            }
            prevDirection *= -1;
            applyToFirstNonNone(field, lastMove, prevDirection, (j) => {
                ind = j;
            });
            if (ind >= 0) {
                return ind;
            }
            console.table("Err1", currVerdict, prevDirection, lastMove, field);
            return getRandomIndex(field);
        }
        if (currVerdict === VERDICT.KILL) {
            applyBothSides(field, lastMove, (ind) => {
                field[ind] = VERDICT.IMPOSSIBLE_BY_RULES;
            });
            prevDirection = 0;
            return getRandomIndex(field);
        } else if (currVerdict === VERDICT.MISS) {
            if (prevDirection !== 0) {
                prevDirection *= -1;
                let ind = -1;
                applyToFirstNonNone(field, lastMove, prevDirection, (j) => {
                    ind = j;
                });
                if (ind >= 0) {
                    return ind;
                }
                console.table("Err", currVerdict, prevDirection, lastMove, field);
                // should never happen;
                prevDirection = 0;
                return getRandomIndex(field);
            }
            return getRandomIndex(field);
        }

        return getRandomIndex(field);
    }

    function guessPublic(currVerdict) {
        const move = guess(field, currVerdict);
        assert(move >=0 && move < field.length, "In bounds3");
        if (move === prevIndex) {
            console.error("Same index", move);
        }
        prevIndex = move;
        return move;
    }

    function setLastMove(n) {
        assert(n >=0 && n < field.length, "In bounds");
        lastMove = n;
    }

    return {
        guess: guessPublic,
        setLastMove
    };
}
