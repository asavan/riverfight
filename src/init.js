export default function init(document, window) {
    function ship(lenght) {
        console.log(lenght);
        const shipyard = document.querySelector(".shipyard");
        const s = document.createElement('div');
        s.classList.add("ship");
        s.style.width = (lenght * 20) + 'px';
        shipyard.appendChild(s);
        return s;
    }

    ship(3);
    for (let i = 0; i < 2; i++) {
        ship(2);
    }

    let s = null;
    for (let i = 0; i < 3; i++) {
        s = ship(1);
    }
    s.classList.add("diagonal-line");

    return {ship: ship};
}
