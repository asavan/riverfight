export default function game(document, window, field) {
    const width = 20;
    const grid = document.querySelector(".grid");

    const t = document.querySelector('#field-template');
    const f = t.content.cloneNode(true);
    const enemyFieldHtml = f.firstElementChild;
    grid.appendChild(f).firstElementChild;
    enemyFieldHtml.classList.add("adjust-second");
    const river = enemyFieldHtml.querySelector(".river");

    function putDotHtml(n) {
        const t = document.querySelector('#dot-template');
        const f = t.content.cloneNode(true);
        const dot = f.firstElementChild;
        river.appendChild(f);
        dot.style.left = (n * width + (width - 10) / 2) + 'px';
    }

    river.addEventListener("click", (e) => {
        const n = Math.floor((e.offsetX + 1) / width);
        putDotHtml(n);
    });

    // putDotHtml(0);
}
