export const width = 20;

export function getClickIndex(e) {
    return Math.floor((e.offsetX + 1) / width);
}

export function move(e, f) {
    const n = getClickIndex(e);
    f(n);
}

export function createField(grid, document, translator) {
    const t = document.querySelector("#field-template");
    const f = t.content.cloneNode(true);
    const field = f.firstElementChild;
    const text = field.querySelector(".frame-text");
    const axisPromise = translator.t("axis");
    axisPromise.then(axis => {
        for (const axi of axis) {
            const s = document.createElement("span");
            s.textContent = axi;
            text.appendChild(s);
        }
    });
    grid.appendChild(field);
    return field;
}

let printingInterval = null;

export async function printLetterByLetter(messagePromise, speed, isEnemyPlayer, waitAfterLastSymbol, document) {
    let i = 0;
    const message = await messagePromise;
    const messageAnchor = document.querySelector(".message");
    if (isEnemyPlayer) {
        messageAnchor.classList.add("enemy");
    } else {
        messageAnchor.classList.remove("enemy");
    }
    messageAnchor.textContent = "";
    if (printingInterval) {
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
