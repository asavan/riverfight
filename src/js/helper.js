"use strict";

import {axis} from "./core.js";

export const width = 20;

export function getClickIndex(e) {
    return Math.floor((e.offsetX + 1) / width);
}

export function move(e, f) {
    const n = getClickIndex(e);
    // console.log("move " + n);
    f(n);
}

export function getTemplateByName(name) {
    return document.querySelector(name);
}

export function hide(selector) {
    const el = document.querySelector(selector);
    hideElem(el);
}

export function hideElem(el) {
    if (el) {
        el.classList.add("hidden");
    }
}

export function createField(grid) {
    const t = getTemplateByName("#field-template");
    const f = t.content.cloneNode(true);
    const field = f.firstElementChild;
    const text = field.querySelector(".frame-text");
    for (const axi of axis) {
        const s = document.createElement("span");
        s.textContent = axi;
        text.appendChild(s);
    }
    grid.appendChild(f).firstElementChild;
    return field;
}

let printingInterval = null;

export function printLetterByLetter(message, speed, isEnemyPlayer, waitAfterLastSymbol) {
    let i = 0;
    const messageAnchor = document.querySelector(".message");
    if (isEnemyPlayer) {
        messageAnchor.classList.add("enemy");
    } else {
        messageAnchor.classList.remove("enemy");
    }
    if (printingInterval) {
        messageAnchor.textContent = "";
        clearInterval(printingInterval);
    }
    printingInterval = setInterval(() => {
        if (i < message.length) {
            messageAnchor.textContent += message.charAt(i);
            ++i;
        } else {
            clearInterval(printingInterval);
            printingInterval = setTimeout(() => {
                messageAnchor.textContent = "";
            }, waitAfterLastSymbol);
        }
    }, speed);
}

export function showGameMessage(message) {
    printLetterByLetter(message, 70, false, 2000);
}

function getWebSocketUrl(protocol, socketUrl, host, settings) {
    if (socketUrl) {
        return socketUrl;
    }
    if (protocol === "https:") {
        return;
    }
    return "ws://" + host + ":" + settings.wsPort;
}

export function getSocketUrl(location, settings) {
    return getWebSocketUrl(location.protocol, settings.wh, location.hostname, settings);
}

export function getStaticUrl(location, settings) {
    return settings.sh || location.origin;
}

export function log(message, el) {
    if (typeof message == "object") {
        el.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + "<br />";
    } else {
        el.innerHTML += message + "<br />";
    }
}
