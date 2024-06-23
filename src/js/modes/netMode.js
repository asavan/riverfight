"use strict";

import { printLetterByLetter } from "../views/helper.js";
import { getSocketUrl, getStaticUrl } from "../connection/common.js";
import connection from "../connection/connection.js";
import { getOtherColor } from "../core.js";
import { removeElem, makeQrPlainEl } from "../views/qr_helper.js";
import placement from "../views/placement.js";
import protocol from "../connection/protocol.js";
import onGameReady from "./common.js";
import setupLocalGame from "./aiMode.js";

function addQrToPage(staticHost, document, color) {
    const url = new URL(staticHost);
    url.searchParams.set("color", getOtherColor(color));
    const qrcontainer = document.querySelector(".qrcontainer");
    const element = document.createElement("div");
    element.classList.add("qrcode");
    qrcontainer.appendChild(element);
    return makeQrPlainEl(url.toString(), element);
}


export default function netGame(window, document, settings) {
    const color = settings.color;
    let useAi = false;
    const socketUrl = getSocketUrl(window.location, settings);
    const staticHost = getStaticUrl(window.location, settings);
    let code = null;
    const enemyFieldPromise = Promise.withResolvers();

    const useNetwork = !!socketUrl && !settings.showqrfake;

    if (settings.showqrfake) {
        code = addQrToPage(staticHost, document, color);
    }

    if (useNetwork) {
        connection.on("socket_open", () => {
            code = addQrToPage(staticHost, document, color);
        });

        connection.on("socket_error", () => {
            // const logger = document.getElementsByClassName("logger")[0];
            // log(e, logger);
            useAi = true;
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
                enemyFieldPromise.resolve(enemyField);
            });
        });
    } else {
        useAi = true;
    }

    const battlePromise = Promise.withResolvers();
    const myField = placement(document);
    myField.myFieldPromise.then((initObj) => {
        if (useAi) {
            removeElem(code);
            const g = setupLocalGame(document, initObj, settings, useAi);
            battlePromise.resolve(g);
        } else {
            const field = initObj.field;
            printLetterByLetter("Ждем оппонента", 70, false, 100000);
            const opponentAlreadyConnected = connection.sendMessage(protocol.toField(field));
            enemyFieldPromise.promise.then((fieldEnemy) => {
                if (!opponentAlreadyConnected) {
                    const opponentAlreadyConnected2 = connection.sendMessage(protocol.toField(field));
                    if (opponentAlreadyConnected2) {
                        console.log("Smth strange");
                    }
                }
                const g = onGameReady(document, initObj, fieldEnemy, settings);
                g.on("playerMove", (n) => connection.sendMessage(protocol.toMove(n)));
                connection.on("recv", (data) => {
                    protocol.parser(data, "move", (n) => {
                        console.log("Enemy try to move " + n);
                        g.fireEnemy(n);
                    });
                });
                battlePromise.resolve(g);
            });
        }
    });

    const getBattle = () => battlePromise.promise;

    return {myField, getBattle};
}
