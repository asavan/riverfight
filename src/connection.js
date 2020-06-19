import settings from "./settings";

let ws = null;
let user = "";
let user2 = "";

const colors = ['blue', 'red'];

function stub(message) {
    console.log("Stub " + message);
}

const handlers = {
    'recv': stub
}

function on(name, f) {
    handlers[name] = f;
}

function getOtherColor(color) {
    for (const colorOther of colors) {
        if (color === colorOther) {
            continue;
        }
        return colorOther;
    }
    return "";
}

function connect(host, wsPort, color) {
    ws = new WebSocket("ws://" + host + ":" + wsPort);

    let peerConnection = null;

    ws.onopen = function (e) {
        console.log("Websocket opened");
        // wsconnect.hide();
        user = color;
        user2 = getOtherColor(color);
        if (user === 'blue') {
            peerConnection = connectToSecond(ws);
        }
    }
    ws.onclose = function (e) {
        console.log("Websocket closed");
        // wsconnect.show();
    }
    ws.onmessage = function (e) {

        const json = JSON.parse(e.data);
        if (json.to !== user) {
            // console.log("same user");
            return;
        }
        console.log("Websocket message received: " + e.data);

        if (json.action === "candidate") {
            processIce(json.data, peerConnection);
        } else if (json.action === "offer") {
            // incoming offer
            user2 = json.from;
            peerConnection = processOffer(json.data)
        } else if (json.action === "answer") {
            // incoming answer
            processAnswer(json.data, peerConnection);
        }
    }
    ws.onerror = function (e) {
        console.log("Websocket error");
    }
}

var config = {"iceServers": []};
// var connection = {};

let dataChannel = null;
let isConnected = false;

function connectedStatus() {
    return isConnected;
}


function connectToSecond() {
    const peerConnection = openDataChannel(ws);

    const sdpConstraints = {offerToReceiveAudio: false, offerToReceiveVideo: false};
    peerConnection.createOffer(sdpConstraints)
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            console.log("------ SEND OFFER ------");
            sendNegotiation("offer", peerConnection.localDescription, ws);
        })
        .catch((err) => console.log(err));
    return peerConnection;
}

function sendMessage(messageBody) {
    if (!dataChannel) {
        return false;
    }
    if (!isConnected) {
        console.log("Not connected");
        return false;
    }
    // console.log("Sending over datachannel: " + messageBody);
    dataChannel.send(messageBody);
    return isConnected;
}

function openDataChannel(ws) {
    const peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = function (e) {
        if (!peerConnection || !e || !e.candidate) return;
        sendNegotiation("candidate", e.candidate, ws);
    }

    dataChannel = peerConnection.createDataChannel("my channel", {negotiated: true, id: settings.negotiatedId});
    dataChannel.onmessage = function (e) {
        console.log("DC from [" + user2 + "]:" + e.data);
        handlers['recv'](e.data);
        console.log("received: " + e.data);
    };


    // dataChannel = peerConnection.createDataChannel("datachannel", {reliable: false});

    dataChannel.onopen = function () {
        console.log("------ DATACHANNEL OPENED ------");
        isConnected = true;
        // sendform.show();
    };

    dataChannel.onclose = function () {
        console.log("------ DC closed! ------");
        isConnected = false;
    };

    dataChannel.onerror = function () {
        console.log("DC ERROR!!!")
    };

    return peerConnection;
}

function sendNegotiation(type, sdp, ws) {
    const json = {from: user, to: user2, action: type, data: sdp};
    console.log("Sending [" + user + "] to [" + user2 + "]: " + JSON.stringify(sdp));
    return ws.send(JSON.stringify(json));
}

function processOffer(offer) {
    const peerConnection = openDataChannel(ws);
    // peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).catch(e => {
    //     console.log(e)
    // });
    const sdpConstraints = {
        'mandatory':
            {
                'OfferToReceiveAudio': false,
                'OfferToReceiveVideo': false
            }
    };

    console.log("------ PROCESSED OFFER ------");
    peerConnection.setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            console.log("------ TRY SEND ANSWER ------");
            return sendNegotiation("answer", peerConnection.localDescription, ws);
        })
        .catch((err) => console.log(err));
    return peerConnection;
}

function processAnswer(answer, peerConnection) {
    console.log("------ PROCESSED ANSWER ------");
    return peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function processIce(iceCandidate, peerConnection) {
    console.log("------ PROCESSED ISE ------", iceCandidate);
    return peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate)).catch(e => {
        console.log(e)
    });
}

export default {connect, sendMessage, on, connectedStatus};
