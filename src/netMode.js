import {defer, removeElem, printLetterByLetter} from "./helper";
import connection from "./connection";
import {getOtherColor} from "./core";
import qrRender from "./qrcode.js";
import settings from "./settings";
import placement from "./placement";
import protocol from "./protocol";
import aiActions from "./aiMode.js";
import battle from "./battle";

function getWebSocketUrl(socketUrl, host) {
    if (window.location.protocol === 'https:') {
        return null;
    }
    if (socketUrl) {
        return "ws://" + socketUrl;
    }
    return "ws://" + host + ":" + settings.wsPort
}

export default function netGame() {
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const color = urlParams.get('color') || 'blue';
    const forceAi = !!urlParams.get('forceAi');
    let useAi = !urlParams.get('color') || urlParams.get('color') === 'red' || forceAi;
    const socketUrl = getWebSocketUrl(urlParams.get('wh'), host);
    let staticHost = urlParams.get('sh') || window.location.href;
    let code = null;
    let isOpponentReady = false;
    let g = null;
    const enemyFieldPromise = defer();
    const battlePromise = defer();

    const myField = placement(document);

    let useNetwork = !forceAi && !!socketUrl;
    if (useNetwork) {
        connection.on('socket_open', () => {
            const url = new URL(staticHost);
            url.searchParams.set('color', getOtherColor(color));
            code = qrRender(url.toString(), document.querySelector(".qrcode"));
        });

        connection.on('socket_close', () => {
            removeElem(code);
        });

        try {
            connection.connect(socketUrl, color);
        } catch (e) {
            useAi = true;
            console.log(e);
        }

        connection.on('open', () => {
            useAi = false;
        });

        connection.on('recv', (data) => {
            protocol.parser(data, 'field', (enemyField) => {
                console.log("enemy field ready");
                if (!isOpponentReady) {
                    enemyFieldPromise.resolve(enemyField);
                }
                isOpponentReady = true;
            });
            protocol.parser(data, 'move', (n) => {
                console.log("Enemy try to move " + n);
                g.fireEnemy(n);
            });
        });
    }

    myField.myFieldPromise.then((initObj) => {
        const field = initObj.field;
        if (useAi) {
            removeElem(code);
            g = aiActions(field, initObj, color);
            battlePromise.resolve(g);
        } else {
            printLetterByLetter("Ждем оппонента", 70, false, 100000);
            const opponentAlreadyConnected = connection.sendMessage(protocol.toField(field));
            enemyFieldPromise.then((enemyField) => {
                if (!opponentAlreadyConnected) {
                    const opponentAlreadyConnected2 = connection.sendMessage(protocol.toField(field));
                    if (opponentAlreadyConnected2) {
                        console.log("Smth strange");
                    }
                }
                initObj.onOpponentReady();
                g = battle(document, window, field, enemyField, color);
                g.on('playerMove', (n) => connection.sendMessage(protocol.toMove(n)));
                battlePromise.resolve(g);
            });
        }
    });

    function getBattle() {
        return battlePromise;
    }

    return {myField, getBattle};

}
