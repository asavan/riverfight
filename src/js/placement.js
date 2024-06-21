"use strict";

import { move, width, getClickIndex, createField, showGameMessage } from "./helper.js";
import { shipsCount, axis } from "./core.js";

export default function placement(document) {
    const myFieldPromise = Promise.withResolvers();

    function getShipyard(document, grid) {
        const s = document.createElement("div");
        s.classList.add("shipyard");
        grid.appendChild(s);
        return s;
    }

    let currChosen = null;
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
            field[currPos + i] = 1;
        }
        --shipsLeft;
        return true;
    }

    const ships = [];
    const grid = document.querySelector(".grid");
    const fieldHtml = createField(grid);
    fieldHtml.classList.add("adjust-first");
    const shipyard = getShipyard(document, grid);

    function ship(length) {
        const s = document.createElement("div");
        s.classList.add("ship");
        s.style.width = (length * width) + "px";
        shipyard.appendChild(s);
        return {length: length, html: s};
    }

    function addShip(length) {
        ships.push(ship(length));
        ++shipsLeft;
    }

    for (const [, shipInfo] of Object.entries(shipsCount)) {
        for (let i = 0; i < shipInfo.count; i++) {
            addShip(shipInfo.len);
        }
    }

    function choose(shipsKey, n) {
        currChosen = {s: shipsKey, n: n};
        for (const shipsKey1 of ships) {
            shipsKey1.html.classList.remove("choosen");
        }
        shipsKey.html.classList.add("choosen");
    }

    for (const shipsKey of ships) {
        shipsKey.html.addEventListener("click", (e) => {
            e.preventDefault();
            const n = getClickIndex(e);
            choose(shipsKey, n);
        });
    }

    const river = fieldHtml.querySelector(".river");
    river.addEventListener("click", clickHandler);

    function onOpponentReady() {
        fieldHtml.classList.remove("adjust-first");
        fieldHtml.classList.add("adjust-third");
        river.removeEventListener("click", clickHandler);
    }

    function putShip(n) {
        if (currChosen == null) {
            showGameMessage("Выберите корабль");
            return false;
        }

        const currentPos = n - currChosen.n;
        if (!place(field, currentPos, currChosen.s.length)) {
            showGameMessage("Тесно!");
            return false;
        }

        const s = document.createElement("div");
        s.classList.add("ship-river");
        s.classList.add("diagonal-line");
        s.style.width = currChosen.s.html.style.width;
        s.style.left = (currentPos * width) + "px";
        river.appendChild(s);
        currChosen.s.html.classList.add("disabled");
        currChosen = null;
        if (isReady()) {
            myFieldPromise.resolve({field, onOpponentReady});
        }
        return true;
    }

    function clickHandler(e) {
        e.preventDefault();
        move(e, putShip);
    }

    function isReady() {
        return shipsLeft === 0;
    }
    return {myFieldPromise: myFieldPromise.promise, onOpponentReady, putShip, ships, choose};
}
