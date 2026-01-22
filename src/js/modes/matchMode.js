import { printLetterByLetter } from "../views/helper.js";
import { getSocketUrl, getStaticUrl } from "../connection/common.js";
import connection from "../connection/connection.js";
import { getOtherColor } from "../core.js";
import { removeElem, makeQrPlainEl } from "../views/qr_helper.js";
import placement from "../views/placement.js";
import protocol from "../connection/protocol.js";
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

async function setupRound(connection, document, settings, myField, enemyFieldPromise, trans) {
    const initObj = await myField.ready();
    const field = initObj.field;
    printLetterByLetter(trans.t("wait"), 70, false, 100000, document);
    connection.sendMessage(protocol.toField(field));
    const fieldEnemy = await enemyFieldPromise;
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
            requestAnimationFrame(() => oneRound(connection, document, settings, trans));
        }, { signal });

        connection.on("recv", (data) => {
            protocol.parser(data, "restart", (color) => {
                rightCode.textContent = oldValue;
                rightCode.classList.remove("clickable");
                controller.abort();
                settings.color = color;
                requestAnimationFrame(() => oneRound(connection, document, settings, trans));
            });
        });
    });
    return g;
}

function oneRound(connection, document, settings, trans) {
    cleanup(document);
    const myField = placement(document, trans);
    const enemyFieldPromise = Promise.withResolvers();
    connection.on("recv", (data) => {
        protocol.parser(data, "field", (enemyField) => {
            console.log("enemy field ready");
            enemyFieldPromise.resolve(enemyField);
        });
    });

    const battlePromise = setupRound(connection, document, settings,
        myField, enemyFieldPromise.promise, trans);
    const getBattle = () => battlePromise;
    const game = {myField, getBattle};
    placementAutomation(game);
}

export default function matchGame(window, document, settings, trans) {
    const color = settings.color;
    const socketUrl = getSocketUrl(window.location, settings);
    const staticHost = getStaticUrl(window.location, settings);
    let code = null;
    connection.on("socket_open", () => {
        code = addQrToPage(staticHost, document, color);
    });

    connection.on("socket_error", (e) => {
        console.error(e);
    });

    connection.on("socket_close", () => {
        removeElem(code);
    });

    const gameName = document.querySelector(".gamename");
    if (gameName) {
        const newNamePromise = trans.t("game");
        newNamePromise.then(name => {
            gameName.textContent = name;
        });
        document.documentElement.lang = trans.getLang();
    }

    connection.connect(socketUrl, color, getOtherColor(color), settings);
    connection.on("open", () => {
        removeElem(code);
        return oneRound(connection, document, settings, trans);
    });
}
