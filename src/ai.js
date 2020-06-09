import { VERDICT, applyBothSides, applyToFirstNonNone } from './core.js';

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
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
    return randomIndex(noneCount);
}

// let prevIndex = -1;

function getRandomIndex(field) {
    let index = chooseRandomIndex(field);
    let i = 0;
    console.table("rnd index " + index);
    for (; i < field.length; i++) {
        if (field[i] === VERDICT.NONE) {
            --index;
        }
        if (index < 0) {
            break;
        }
    }
    if (i >= field.length || i < 0) {
        console.table("Error out", i, field);
    }
    // if (prevIndex === i) {
    //     console.table("Error repeated", i, field);
    // }
    // prevIndex = i;
    return i;
}

function randomDirection() {
    let dir = randomIndex(2);
    if (dir === 0) {
        return -1;
    }
    return dir;
}

export function generateAiField(ind) {
    const fields = [ [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1]];
    if (ind < 0) {
        ind = randomIndex(fields.length);
    }
    return fields[ind];
}

export function ai(len, fieldNum) {
    const fieldEnemy = generateAiField(fieldNum);
    const field = new Array(len).fill(VERDICT.NONE);
    let lastMove = -1;
    let prevDirection = 0;
    function guess(field, currVerdict) {
        if (lastMove < 0) {
            return getRandomIndex(field);
        }
        field[lastMove] = currVerdict;
        if (currVerdict === VERDICT.HIT) {
            prevDirection = randomDirection();
            let ind = -1;
            applyToFirstNonNone(field, lastMove, prevDirection, (j) => {ind = j;});
            if (ind >= 0) {
                return ind;
            }
            prevDirection *= -1;
            applyToFirstNonNone(field, lastMove, prevDirection, (j) => {ind = j;});
            if (ind >= 0) {
                return ind;
            }
            console.table("Err1", currVerdict, prevDirection, lastMove, field );
            return getRandomIndex(field);
            // throw "Illegal state";
        }
        if (currVerdict === VERDICT.KILL) {
            applyBothSides(field, lastMove, (ind) => {field[ind] = VERDICT.IMPOSSIBLE_BY_RULES;})
            prevDirection = 0;
            return getRandomIndex(field);
        } else if (currVerdict === VERDICT.MISS) {
            if (prevDirection !== 0) {
                prevDirection *= -1;
                let ind = -1;
                applyToFirstNonNone(field, lastMove, prevDirection, (j) => {ind = j;});
                if (ind >= 0) {
                    return ind;
                }
                console.table("Err", currVerdict, prevDirection, lastMove, field );
                return getRandomIndex(field);

                // throw "Illegal state";
            }
            return getRandomIndex(field);
        }

        return 1;
    }

    function guessPublic(currVerdict) {
        console.log(currVerdict);
        lastMove = guess(field, currVerdict);
        return lastMove;
    }

    function getFieldEnemy() {
        return fieldEnemy;
    }
    return {
        getFieldEnemy: getFieldEnemy,
        guess: guessPublic
    }
}
