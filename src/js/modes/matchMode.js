"use strict";

import { printLetterByLetter, getSocketUrl, getStaticUrl, log} from "../helper.js";
import connection from "../connection.js";
import {getOtherColor} from "../core.js";
import { removeElem, makeQrPlainEl } from "../qr_helper.js";
import placement from "../placement.js";
import protocol from "../protocol.js";
import onGameReady from "./common.js";
import { placementAutomation } from "../automation.js";

function addQrToPage(staticHost, document, color) {
    const url = new URL(staticHost);
    url.searchParams.set("color", getOtherColor(color));
    url.searchParams.set("mode", "match");
    const qrcontainer = document.querySelector(".qrcontainer");
    const element = document.createElement("div");
    element.classList.add("qrcode");
    qrcontainer.appendChild(element);
    return makeQrPlainEl(url.toString(), element);
}

function cleanup(document) {
    const grid = document.querySelector(".grid");
    grid.replaceChildren();
    const messageAnchor = document.querySelector(".message");
    messageAnchor.textContent = "";

    const overlay = document.querySelector(".overlay");
    overlay.classList.remove("show");
}

function oneRound(connection, document, settings) {
    const battlePromise = Promise.withResolvers();
    cleanup(document);
    const myField = placement(document);
    const enemyFieldPromise = Promise.withResolvers();
    connection.on("recv", (data) => {
        protocol.parser(data, "field", (enemyField) => {
            console.log("enemy field ready");
            enemyFieldPromise.resolve(enemyField);
        });
    });

    myField.myFieldPromise.then((initObj) => {
        const field = initObj.field;
        printLetterByLetter("Ждем оппонента", 70, false, 100000);
        connection.sendMessage(protocol.toField(field));
        enemyFieldPromise.promise.then((fieldEnemy) => {
            const g = onGameReady(document, initObj, fieldEnemy, settings);
            g.on("playerMove", (n) => connection.sendMessage(protocol.toMove(n)));
            connection.on("recv", (data) => {
                protocol.parser(data, "move", (n) => {
                    // console.log("Enemy try to move " + n);
                    g.fireEnemy(n);
                });
            });
            g.on("gameover", () => {
                const rightCode = document.querySelector(".secret-code2");
                const oldValue = rightCode.textContent;
                rightCode.textContent = "🔃";
                const controller = new AbortController();
                const { signal } = controller;
                rightCode.classList.add("clickable");
                rightCode.addEventListener("click", (e) => {
                    e.preventDefault();
                    rightCode.textContent = oldValue;
                    rightCode.classList.remove("clickable");
                    controller.abort();
                    connection.sendMessage(protocol.toRestart(settings.color));
                    settings.color = getOtherColor(settings.color);
                    requestAnimationFrame(() => oneRound(connection, document, settings));
                }, { signal });

                connection.on("recv", (data) => {
                    protocol.parser(data, "restart", (color) => {
                        rightCode.textContent = oldValue;
                        rightCode.classList.remove("clickable");
                        controller.abort();
                        settings.color = color;
                        requestAnimationFrame(() => oneRound(connection, document, settings));
                    });
                });
            });
            battlePromise.resolve(g);
        });
    });
    const getBattle = () => battlePromise.promise;
    const game = {myField, getBattle};
    placementAutomation(game);
}

export default function matchGame(window, document, settings) {
    const color = settings.color;
    const socketUrl = getSocketUrl(window.location, settings);
    const staticHost = getStaticUrl(window.location, settings);
    let code = null;
    connection.on("socket_open", () => {
        code = addQrToPage(staticHost, document, color);
    });

    connection.on("socket_error", (e) => {
        const logger = document.getElementsByClassName("logger")[0];
        log(e, logger);
    });

    connection.on("socket_close", () => {
        removeElem(code);
    });

    connection.connect(socketUrl, color, getOtherColor(color), settings);
    connection.on("open", () => {
        removeElem(code);
        return oneRound(connection, document, settings);
    });
}
