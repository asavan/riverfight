import "./css/style.css";

import settings from "./settings";
import init from "./init";
import game from "./game";
import {ai, generateAiField} from "./ai";
import connection from "./connection";
import protocol from "./protocol";

function onReady(field) {
    // console.log(field);
    const aiBot = ai(field.length, -1);
    const g = game(document, window, field, aiBot.getFieldEnemy(), 'blue');

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        console.log("ai move " + n);
        setTimeout(() => {
            g.fireEnemy(n);
        }, 700);
    }
    g.on('aiMove', onAiMove);
}

function netGame() {
    // console.log(field);
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const color = urlParams.get('color') || 'blue';

    connection.connect(host, settings.wsPort, color);

    const myField = init(document);
    let promiseResolve;
    let g = null;
    const enemyFieldPromise = new Promise(function(resolve, reject) {
        promiseResolve = resolve;
    });

    connection.on('recv', (data) => {
        console.log("recieved", data);

        protocol.parser(data, 'field', (enemyField) => {
            console.log("enemyFieldReady", enemyField);
            promiseResolve(enemyField);
        });
        protocol.parser(data, 'move', (n) => {
            console.log("Enemy try to move " + n);
            g.fireEnemy(n)
        });
        // g.fireEnemy(protocol.parser(data));
    });

    myField.then((field) => connection.sendMessage(protocol.toField(field)))

    Promise.all([myField, enemyFieldPromise]).then(values => {
        console.log(values);
        g = game(document, window, values[0], values[1], color);
        g.on('playerMove', (n) => connection.sendMessage(protocol.toMove(n)));
    });
}

function ppp() {
    const g = game(document, window, field, f, color);
    protocol.parser(data, 'move', (n) => {g.fireEnemy(n)});
    g.on('playerMove', (n) => connection.sendMessage(protocol.toMove(n)));
}

function fake() {
    // console.log(field);
    const aiBot = ai(generateAiField(1).length, 1);
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const color = urlParams.get('color') || 'blue';
    const g = game(document, window, generateAiField(1), aiBot.getFieldEnemy(), color);

    console.log(host);
    connection.connect(host, settings.wsPort, color);

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        console.log("ai move " + n);
        // setTimeout(() => {
        //     g.fireEnemy(n);
        //     connection.sendMessage(n);
        // }, 700);
    }
    g.on('aiMove', onAiMove);

    connection.on('recv', (data) => {
        console.log("recieved", data);

        protocol.parser(data, 'move', (n) => {g.fireEnemy(n)});
        // g.fireEnemy(protocol.parser(data));
    });
    g.on('playerMove', (n) => connection.sendMessage(protocol.toMove(n)));
}

function startGame(mode) {
    switch (mode) {
        case "ai":
            init(document).then(onReady);
            break;
        case "fake":
            fake();
            break;
        case "net":
            netGame();
            break;
    }
}

startGame("net");

if (__USE_SERVICE_WORKERS__) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', {scope: './'});
    }
}
