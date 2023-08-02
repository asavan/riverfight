"use strict";

import {axis} from './core.js';

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
        el.classList.add('hidden');
    }
}

export function removeElem(el) {
    if (el) {
        el.remove();
    }
}

export function createField(grid) {
    const t = getTemplateByName('#field-template');
    const f = t.content.cloneNode(true);
    const field = f.firstElementChild;
    const text = field.querySelector('.frame-text');
    for (const axi of axis) {
        const s = document.createElement("span");
        s.textContent = axi;
        text.appendChild(s);
    }
    grid.appendChild(f).firstElementChild;
    return field;
}

export function defer() {
    let res, rej;

    const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });

    promise.resolve = res;
    promise.reject = rej;

    return promise;
}

let printingInterval = null;

export function printLetterByLetter(message, speed, isEnemyPlayer, waitAfterLastSymbol) {
    let i = 0;
    const messageAnchor = document.querySelector('.message');
    if (isEnemyPlayer) {
        messageAnchor.classList.add('enemy');
    } else {
        messageAnchor.classList.remove('enemy');
    }
    if (printingInterval) {
        messageAnchor.innerHTML = "";
        clearInterval(printingInterval);
    }
    printingInterval = setInterval(function () {
        if (i < message.length) {
            messageAnchor.innerHTML += message.charAt(i);
            ++i;
        } else {
            clearInterval(printingInterval);
            printingInterval = setTimeout(() => {
                messageAnchor.innerHTML = ""
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
    if (protocol === 'https:') {
        return null;
    }
    return "ws://" + host + ":" + settings.wsPort
}

export function getSocketUrl(location, settings) {
    return getWebSocketUrl(location.protocol, settings.wh, location.hostname, settings)
}

export function getStaticUrl(location, settings) {
    return settings.sh || location.href;
}

export function launch(window, document, f) {
    if( document.readyState !== 'loading' ) {
        f(window, document);
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            f(window, document);
        });
    }
}

function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}

export function parseSettings(window, document, settings) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        if (typeof settings[key] === "number") {
            settings[key] = parseInt(value, 10);
        } else if (typeof settings[key] === "boolean") {
            settings[key] = stringToBoolean(value);
        } else {
            settings[key] = value;
        }
    }
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function log(message, el) {
    if (typeof message == 'object') {
        el.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
        el.innerHTML += message + '<br />';
    }
}
