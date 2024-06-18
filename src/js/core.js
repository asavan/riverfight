"use strict";

export const VERDICT = {
    NONE: 0,
    HIT: 1,
    KILL: 2,
    WIN: 3,
    MISS: 4,
    IMPOSSIBLE_BY_RULES: 5
};

export const axis = "абвгдежзиклмнопрст";

export const shipsCount = {
    0 : {len : 3, count : 1},
    1: {len : 2, count : 2},
    2: {len : 1, count : 3}
};

function isShip(verdict) {
    if (verdict === VERDICT.NONE || verdict >= VERDICT.MISS) {
        return 0;
    }
    return 1;
}

function isSame(fieldEnemy, myEnemyField, n) {
    if (fieldEnemy.length !== myEnemyField.length) {
        throw "Illegal state";
    }

    for (let i = 0; i < fieldEnemy.length; ++i) {
        if (i === n) {
            continue;
        }
        if (fieldEnemy[i] !== isShip(myEnemyField[i])) {
            return false;
        }
    }
    return true;
}

function getLen(field, n) {
    return applyBothSides(field, n, ()=>{});
}

export function getVerdict(fieldEnemy, myEnemyField, n) {
    const res = fieldEnemy[n];
    if (!res) {
        return VERDICT.MISS;
    }
    const enemyLen = getLen(fieldEnemy, n);
    const myEnemyLen = getLen(myEnemyField, n);
    // console.log(fieldEnemy, n, enemyLen);
    // console.log(myEnemyField, n, myEnemyLen);
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

export function applyToFirstNonNone(field, n, direction, f) {
    let i = n + direction;
    let count = 0;
    while (i < field.length && i >= 0) {
        if (isShip(field[i])) {
            i += direction;
            ++count;
        } else {
            if (field[i] === VERDICT.NONE) {
                f(i);
            }
            break;
        }
    }
    return count;
}

export function applyBothSides(field, n, f) {
    let count = 1;
    count += applyToFirstNonNone(field, n, 1, f);
    count += applyToFirstNonNone(field, n, -1, f);
    return count;
}

const colors = ["blue", "red"];

export function getOtherColor(color) {
    for (const colorOther of colors) {
        if (color === colorOther) {
            continue;
        }
        return colorOther;
    }
    return "";
}

export function isEnemyStartFirst(color) {
    return color === "red";
}
