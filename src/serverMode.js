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

function oneQrCode(url, code, color, qrcontainer, document) {
    const element = document.createElement('div');
    element.classList.add("qrcode");
    qrcontainer.appendChild(element);
    url.searchParams.set('color', color);
    qrRender(url.toString(), element);
    colorizePath(element, color);
    code[color] = element;
}

export default function server(window, document, settings) {
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const socketUrl = getWebSocketUrl(urlParams.get('wh'), host, settings);
    let staticHost = urlParams.get('sh') || window.location.href;
    let code = {};
    {
        const url = new URL(staticHost);
        url.searchParams.delete('currentMode');
        const qrcontainer = document.querySelector(".qrcontainerserver");
        oneQrCode(url, code, 'blue', qrcontainer, document);
        oneQrCode(url, code, 'red', qrcontainer, document);
    }

    connection.on('socket_open', () => {
        colorizePath(code['blue'], "royalblue");
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
