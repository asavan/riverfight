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
    3 : 1,
    2: 2,
    1: 3
}

function isShip(verdict) {
    if (verdict === VERDICT.NONE || verdict >= VERDICT.MISS) {
        return 0;
    }
    return 1;
}

export function verdictToMessage(verdict) {
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
