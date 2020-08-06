import connection from "./connection.js";
import {getWebSocketUrl, hideElem, removeElem} from "./helper";
import qrRender from "./qrcode.js";

const serverColor = 'black';

function colorizePath(elem, color) {
    if (!elem) {
        return;
    }
    const svgPath = elem.querySelector('path');
    if (svgPath) {
        svgPath.style.fill = color;
    }
}

function oneQrCode(url, code, color, element) {
    url.searchParams.set('color', color);
    const codeElem = qrRender(url.toString(), element);
    colorizePath(codeElem, color);
    code[color] = codeElem;
}

export default function server(window, document, settings) {
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const socketUrl = getWebSocketUrl(urlParams.get('wh'), host, settings);
    let staticHost = urlParams.get('sh') || window.location.href;
    let code = {};
    hideElem(document.querySelector(".container"));
    connection.on('socket_open', () => {
        const url = new URL(staticHost);
        url.searchParams.delete('currentMode');
        oneQrCode(url, code, 'blue', document.querySelector(".qr1"));
        oneQrCode(url, code, 'red', document.querySelector(".qr2"));
    });

    connection.on('server_message', (message) => {
        const json = JSON.parse(message);
        if (json.action === "connected") {
            colorizePath(code[json.from], serverColor);
        } else if (json.action === "close") {
            removeElem(code[json.from]);
        }
    });

    try {
        connection.connect(socketUrl, serverColor, true);
    } catch (e) {
        console.log(e);
    }
}
