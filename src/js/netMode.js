"use strict";

import {defer, removeElem, printLetterByLetter, getSocketUrl, getStaticUrl, log} from "./helper.js";
import connection from "./connection.js";
import {getOtherColor} from "./core.js";
import qrRender from "./qrcode.js";
import placement from "./placement.js";
import protocol from "./protocol.js";
import aiActions from "./aiMode.js";
import battle from "./battle.js";

function addQrToPage(staticHost, document, urlParams, color) {
    const url = new URL(staticHost);
    url.search = urlParams;
    url.searchParams.delete("wh");
    url.searchParams.delete("sh");
    url.searchParams.set("color", getOtherColor(color));
    const qrcontainer = document.querySelector(".qrcontainer");
    const element = document.createElement("div");
    element.classList.add("qrcode");
    qrcontainer.appendChild(element);
    return qrRender(url.toString(), element);
}


export default function netGame(window, document, settings, urlParams) {
    const color = settings.color;
    let useAi = true;
    const socketUrl = getSocketUrl(window.location, settings);
    let staticHost = getStaticUrl(window.location, settings);
    let code = null;
    let isOpponentReady = false;
    let g = null;
    const enemyFieldPromise = defer();
    const battlePromise = defer();

    const myField = placement(document);

    let useNetwork = !!socketUrl && !settings.showqrfake;

    if (settings.showqrfake) {
        code = addQrToPage(staticHost, document, urlParams, color);
    }

    if (useNetwork) {
        connection.on("socket_open", () => {
            code = addQrToPage(staticHost, document, urlParams, color);
        });

        connection.on("socket_error", (e) => {
            const logger = document.getElementsByClassName("logger")[0];
            log(e, logger);
        });

        connection.on("socket_close", () => {
            removeElem(code);
        });

        try {
            connection.connect(socketUrl, color, getOtherColor(color), settings);
        } catch (e) {
            useAi = true;
            console.log(e);
        }

        connection.on("open", () => {
            useAi = false;
        });

        connection.on("recv", (data) => {
            protocol.parser(data, "field", (enemyField) => {
                console.log("enemy field ready");
                if (!isOpponentReady) {
                    enemyFieldPromise.resolve(enemyField);
                }
                isOpponentReady = true;
            });
            protocol.parser(data, "move", (n) => {
                console.log("Enemy try to move " + n);
                g.fireEnemy(n);
            });
        });
    }

    myField.myFieldPromise.then((initObj) => {
        const field = initObj.field;
        if (useAi) {
            removeElem(code);
            g = aiActions(window, document, field, initObj, settings);
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
                g = battle(document, window, field, enemyField, settings);
                g.on("playerMove", (n) => connection.sendMessage(protocol.toMove(n)));
                battlePromise.resolve(g);
            });
        }
    });

    function getBattle() {
        return battlePromise;
    }

    return {myField, getBattle};
}
