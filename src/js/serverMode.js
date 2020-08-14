"use strict";

import connection from "./connection.js";
import {getSocketUrl, getStaticUrl, removeElem} from "./helper.js";
import qrRender from "./qrcode.js";

const SERVER_COLOR = 'black';

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
    element.classList.add('qrcode');
    qrcontainer.appendChild(element);
    url.searchParams.set('color', color);
    qrRender(url.toString(), element);
    colorizePath(element, color);
    code[color] = element;
}

export default function server(window, document, settings) {
    const socketUrl = getSocketUrl(window.location, settings);
    let staticHost = getStaticUrl(window.location, settings);
    let code = {};
    {
        const url = new URL(staticHost);
        url.searchParams.delete('currentMode');
        const qrcontainer = document.querySelector('.qrcontainerserver');
        oneQrCode(url, code, 'blue', qrcontainer, document);
        oneQrCode(url, code, 'red', qrcontainer, document);
    }

    connection.on('socket_open', () => {
        colorizePath(code['blue'], 'royalblue');
    });

    connection.on('server_message', (message) => {
        const json = JSON.parse(message);
        if (json.action === 'connected') {
            colorizePath(code[json.from], SERVER_COLOR);
        } else if (json.action === 'close') {
            removeElem(code[json.from]);
        }
    });

    try {
        connection.connect(socketUrl, SERVER_COLOR, true, settings);
    } catch (e) {
        console.log(e);
    }
}
