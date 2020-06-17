import $ from 'jquery';


$("#setid").click(setMyId);
$("#dc-connect").click(connectTo);
$("#send").click(sendDirect);

var ws = null;
var user = "";
var user2 = "";

const rtcfield = $('.webrtc');
const idform = $("#idform");
const dcform = $("#dcform");
const sendform = $("#sendform");

idform.hide();
dcform.hide();
sendform.hide();

idform.submit(setMyId);
dcform.submit(connectTo);
sendform.submit(sendDirect);


$("#ws-connect").click(function(){
    ws = new WebSocket("ws://192.168.137.1:8088");

    ws.onopen = function(e){
        console.log("Websocket opened");
        idform.show();
    }
    ws.onclose = function(e){
        console.log("Websocket closed");
    }
    ws.onmessage = function(e){
        console.log("Websocket message received: " + e.data);

        var json = JSON.parse(e.data);

        if(json.action === "candidate"){
            if(json.to === user){
                processIce(json.data);
            }
        } else if(json.action === "offer"){
            // incoming offer
            if(json.to === user){
                user2 = json.from;
                processOffer(json.data)
            }
        } else if(json.action === "answer"){
            // incoming answer
            if(json.to === user){
                processAnswer(json.data);
            }
        }
        // else if(json.action == "id"){
        //    userId = json.data;
        // } else if(json.action=="newUser"){
        //     if(userId!=null && json.data!=userId){

        //     }
        // }

    }
    ws.onerror = function(e){
        console.log("Websocket error");
    }
});

function setMyId(e){
    e.preventDefault();
    user = $("#user").val();
    dcform.show();
    return false;
}

var config = {"iceServers":[]};
// var connection = {};

var peerConnection;
var dataChannel;



function connectTo(e){
    e.preventDefault();
    user2 = $("#connectTo").val();
    openDataChannel();

    var sdpConstraints = { offerToReceiveAudio: true,  offerToReceiveVideo: false }
    peerConnection.createOffer(sdpConstraints).then(function (sdp) {
        peerConnection.setLocalDescription(sdp);
        sendNegotiation("offer", sdp);
        console.log("------ SEND OFFER ------");
    }, function (err) {
        console.log(err)
    });

}

function sendDirect(e){
    e.preventDefault();
    const rtcmessage = $("#message");
    const messageBody = rtcmessage.val();
    dataChannel.send(messageBody);
    rtcfield.append('Me: <div class="message-rtc">'+messageBody+'</div>');
    console.log("Sending over datachannel: " + messageBody);
    rtcmessage.val('');
}

function openDataChannel (){
    peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = function(e){
        if (!peerConnection || !e || !e.candidate) return;
        var candidate = e.candidate;
        sendNegotiation("candidate", candidate);
    }

    dataChannel = peerConnection.createDataChannel("datachannel", {reliable: false});

    dataChannel.onopen = function(){
        console.log("------ DATACHANNEL OPENED ------")
        sendform.show();
    };
    dataChannel.onclose = function(){console.log("------ DC closed! ------")};
    dataChannel.onerror = function(){console.log("DC ERROR!!!")};

    peerConnection.ondatachannel = function (ev) {
        console.log('peerConnection.ondatachannel event fired.');
        ev.channel.onopen = function() {
            console.log('Data channel is open and ready to be used.');
        };
        ev.channel.onmessage = function(e){
            console.log("DC from ["+user2+"]:" +e.data);
            rtcfield.append(user2+': <div class="message-rtc from">'+e.data+'</div>')
        }
    };

    return peerConnection;
}

function sendNegotiation(type, sdp){
    var json = { from: user, to: user2, action: type, data: sdp};
    ws.send(JSON.stringify(json));
    console.log("Sending ["+user+"] to ["+user2+"]: " + JSON.stringify(sdp));
}

function processOffer(offer){
    var peerConnection = openDataChannel();
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).catch(e => {
        console.log(e)
    });

    var sdpConstraints = {'mandatory':
            {
                'OfferToReceiveAudio': false,
                'OfferToReceiveVideo': false
            }
    };

    peerConnection.createAnswer(sdpConstraints).then(function (sdp) {
        return peerConnection.setLocalDescription(sdp).then(function() {
            sendNegotiation("answer", sdp);
            console.log("------ SEND ANSWER ------");
        })
    }, function(err) {
        console.log(err)
    });
    console.log("------ PROCESSED OFFER ------");

}

function processAnswer(answer){

    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("------ PROCESSED ANSWER ------");
    return true;
}

function processIce(iceCandidate){
    peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate)).catch(e => {
        debugger
        console.log(e)
    })
}
