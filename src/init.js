export default function init(document, window, onReady) {
    let currChosen = null;
    const axis = "абвгдежзиклмнопрст";
    // const totalLength = axis.length;
    console.log(axis.length);
    const width = 20;
    let shipsLeft = 0;

    const field = new Array(axis.length).fill(0);
    
    function canPlace(field, currPos, len) {
        if (currPos < 0) {
            return false;
        }
        const prevPos = currPos - 1;
        if (prevPos >= 0) {
            if (field[prevPos] > 0) {
                return false;
            }
        }
        for (let i = 0; i < len; i++) {
            const pos = currPos + i;
            if (pos > field.length - 1) {
                return false;
            }
            if (field[pos] > 0) {
                return false;
            }
        }
        const lastPos = currPos + len;
        if (lastPos < field.length) {
            if (field[lastPos] > 0) {
                return false;
            }
        }
        return true;
    }

    function place(field, currPos, len) {
        if (!canPlace(field, currPos, len)) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            field[currPos+i] = 1;
        }
        --shipsLeft;
        return true;
    }

    const ships = [];
    const shipyard = document.querySelector(".shipyard");
    const fieldHtml = document.querySelector(".field");
    fieldHtml.classList.add('adjust-first');

    function ship(length) {
        const s = document.createElement('div');
        s.classList.add("ship");
        s.style.width = (length * width) + 'px';
        shipyard.appendChild(s);
        return {length: length, html: s};
    }

    function addShip(length) {
        ships.push(ship(length));
        ++shipsLeft;
    }

    addShip(3);
    for (let i = 0; i < 2; i++) {
        addShip(2);
    }

    for (let i = 0; i < 3; i++) {
        addShip(1);
    }

    for (const shipsKey of ships) {
        shipsKey.html.addEventListener("click", (e) => {
            const n = Math.floor(e.offsetX / width);
            currChosen = {s: shipsKey, n: n};
            for (const shipsKey1 of ships) {
                shipsKey1.html.classList.remove('choosen');
            }
            shipsKey.html.classList.add('choosen');
        });
    }

    const river = document.querySelector(".river");
    river.addEventListener("click", (e) => {
        if (currChosen == null) {
            return;
        }
        const n = Math.floor((e.offsetX + 1) / width);
        const currentPos = n - currChosen.n;
        if (!place(field, currentPos, currChosen.s.length)) {
            return;
        }

        const s = document.createElement('div');
        s.classList.add("ship_river");
        s.classList.add("diagonal-line");
        s.style.width = currChosen.s.html.style.width;
        s.style.left = (currentPos * width) + 'px';
        river.appendChild(s);
        currChosen.s.html.classList.add('disabled');
        currChosen = null;
        if (isReady()) {
            onReady(field);
        }

        // console.log(e.layerX);

    });
    
    function isReady() {
        console.log(shipsLeft);
        return shipsLeft === 0;
    }

    // return {field: field, isReady: isReady};
}
