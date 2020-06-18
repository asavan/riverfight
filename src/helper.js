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


