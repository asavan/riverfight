import { VERDICT, isShip } from './core.js';

function randomInteger(min, max) {
    // случайное число от min до (max+1)
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
    return randomIndex(noneCount + 1);
}

function getRandomIndex(field) {
    let index = chooseRandomIndex(field);
    let j = 0;
    console.table(index);
    for (; j < field.length; j++) {
        if (field[j] === VERDICT.NONE) {
            --index;
        }
        if (index === 0) {
            break;
        }
    }
    console.table(index, j);
    return j;
}

function randomDirection() {
    let dir = randomIndex(2);
    if (dir === 0) {
        return -1;
    }
    return dir;
}

export default function ai(len) {
    const fieldEnemy = [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];
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
            if (prevDirection > 0) {
                let i = lastMove + prevDirection;
                while (i < field.length) {
                    if (isShip(field[i])) {
                        ++i;
                    } else {
                        if (field[i] === VERDICT.NONE) {
                            return i;
                        }
                        break;
                    }
                }
                prevDirection *= -1;
            } else {
                let i = lastMove + prevDirection;
                while (i >= 0) {
                    if (isShip(field[i])) {
                        --i;
                    } else {
                        if (field[i] === VERDICT.NONE) {
                            return i;
                        }
                        break;
                    }
                }
                prevDirection *= -1;
                i = lastMove + prevDirection;
                while (i < field.length) {
                    if (isShip(field[i])) {
                        ++i;
                    } else {
                        if (field[i] === VERDICT.NONE) {
                            return i;
                        }
                        break;
                    }
                }
            }
            console.table("Err1", currVerdict, prevDirection, lastMove, field );
            return getRandomIndex(field);
            // throw "Illegal state";
        }
        if (currVerdict === VERDICT.KILL) {
            let i = lastMove + 1;
            while (i < field.length) {
                if (isShip(field[i])) {
                    field[i] = currVerdict;
                    ++i;
                } else {
                    field[i] = VERDICT.IMPOSSIBLE_BY_RULES;
                    break;
                }
            }
            i = lastMove - 1;
            while (i >= 0) {
                if (isShip(field[i])) {
                    field[i] = currVerdict;
                    --i;
                } else {
                    field[i] = VERDICT.IMPOSSIBLE_BY_RULES;
                    break;
                }
            }
            return getRandomIndex(field);

        } else if (currVerdict === VERDICT.MISS) {
            if (prevDirection !== 0) {
                prevDirection *= -1;
                if (prevDirection > 0) {
                    let i = lastMove + prevDirection;
                    while (i < field.length) {
                        if (isShip(field[i])) {
                            ++i;
                        } else {
                            if (field[i] === VERDICT.NONE) {
                                return i;
                            }
                            break;
                        }
                    }
                    prevDirection *= -1;
                } else {
                    let i = lastMove + prevDirection;
                    while (i >= 0) {
                        if (isShip(field[i])) {
                            --i;
                        } else {
                            if (field[i] === VERDICT.NONE) {
                                return i;
                            }
                            break;
                        }
                    }
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
