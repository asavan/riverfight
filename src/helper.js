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
    grid.appendChild(f).firstElementChild;
    return field;
}
