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
        console.log("Websocket message received: " + e.data);

        var json = JSON.parse(e.data);

        if (json.action === "candidate") {
            if (json.to === user) {
                processIce(json.data, peerConnection);
            }
        } else if (json.action === "offer") {
            // incoming offer
            if (json.to === user) {
                user2 = json.from;
                peerConnection = processOffer(json.data)
            }
        } else if (json.action === "answer") {
            // incoming answer
            if (json.to === user) {
                processAnswer(json.data, peerConnection);
            }
        }
        // else if(json.action == "id"){
        //    userId = json.data;
        // } else if(json.action=="newUser"){
        //     if(userId!=null && json.data!=userId){

        //     }
        // }

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

    const sdpConstraints = {offerToReceiveAudio: true, offerToReceiveVideo: false};
    peerConnection.createOffer(sdpConstraints).then(function (sdp) {
        peerConnection.setLocalDescription(sdp);
        sendNegotiation("offer", sdp, ws);
        console.log("------ SEND OFFER ------");
    }, function (err) {
        console.log(err)
    });
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

    dataChannel = peerConnection.createDataChannel("datachannel", {reliable: false});

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

    peerConnection.ondatachannel = function (ev) {
        console.log('peerConnection.ondatachannel event fired.');
        ev.channel.onopen = function () {
            console.log('Data channel is open and ready to be used.');
        };
        ev.channel.onmessage = function (e) {
            console.log("DC from [" + user2 + "]:" + e.data);
            handlers['recv'](e.data);
        }
    };

    return peerConnection;
}

function sendNegotiation(type, sdp, ws) {
    const json = {from: user, to: user2, action: type, data: sdp};
    ws.send(JSON.stringify(json));
    console.log("Sending [" + user + "] to [" + user2 + "]: " + JSON.stringify(sdp));
}

function processOffer(offer) {
    const peerConnection = openDataChannel(ws);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).catch(e => {
        console.log(e)
    });

    const sdpConstraints = {
        'mandatory':
            {
                'OfferToReceiveAudio': false,
                'OfferToReceiveVideo': false
            }
    };

    peerConnection.createAnswer(sdpConstraints).then(function (sdp) {
        return peerConnection.setLocalDescription(sdp).then(function () {
            sendNegotiation("answer", sdp, ws);
            console.log("------ SEND ANSWER ------");
        })
    }, function (err) {
        console.log(err)
    });
    console.log("------ PROCESSED OFFER ------");
    return peerConnection;
}

function processAnswer(answer, peerConnection) {

    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("------ PROCESSED ANSWER ------");
    return true;
}

function processIce(iceCandidate, peerConnection) {
    console.log("------ PROCESSED ISE ------", iceCandidate);
    peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate)).catch(e => {
        debugger
        console.log(e)
    })
}

export default {connect, sendMessage, on, connectedStatus};
