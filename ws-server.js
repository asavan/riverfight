const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 8088});
const wsList = [];

wss.on('connection', function (ws) {
    console.log('WS connection established!')
    wsList.push(ws);

    ws.on('close', function () {
        wsList.splice(wsList.indexOf(ws), 1);
        console.log('WS closed!')
    });

    ws.on('message', function (message) {
        console.log('Got ws message: ' + message);
        for (let i = 0; i < wsList.length; i++) {
            // send to everybody on the site
            wsList[i].send(message);
        }
    });
});
