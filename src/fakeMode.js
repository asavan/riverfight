import {ai, generateAiField} from "./ai";
import battle from "./battle";
import connection from "./connection";
import settings from "./settings";
import protocol from "./protocol";

function getWebSocketUrl(host) {
    let prefix = "ws://";
    if (window.location.protocol === 'https:') {
        prefix = "wss://";
    }

    // return prefix + host + ":" + wsPort
    return prefix + host;
}

export default function fake() {
    const field = generateAiField(1);
    const aiBot = ai(field.length);
    const host = window.location.hostname;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const color = urlParams.get('color') || 'blue';
    const g = battle(document, window, field, field, color);

    console.log(host);
    connection.connect(getWebSocketUrl(host + ":" + settings.wsPort), color);

    function onAiMove(verdict) {
        const n = aiBot.guess(verdict);
        console.log("ai move " + n);
    }

    g.on('aiMove', onAiMove);

    connection.on('recv', (data) => {
        console.log("received", data);
        protocol.parser(data, 'move', (n) => {
            g.fireEnemy(n);
        });
    });
    g.on('playerMove', (n) => connection.sendMessage(protocol.toMove(n)));
}
