import { WebSocketServer, WebSocket } from "ws";
import settings from "../src/js/settings.js";
const wss = new WebSocketServer({port: settings.wsPort});

wss.on("connection", (ws, req) => {
    console.log("WS connection established!", req.socket.remoteAddress, req.headers['sec-websocket-key']);

    ws.on("close", function () {
        console.log("WS closed!");
    });

    ws.on("message", function (message) {
        console.log("Got ws message: " + message);
        for (const candidate of wss.clients) {
            // send to everybody on the site, except sender
            if (candidate !== ws && candidate.readyState === WebSocket.OPEN) {
                // console.log("Send ws message: " + message);
                candidate.send(message);
            }
        }
    });
});
