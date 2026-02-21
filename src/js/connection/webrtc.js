import {delay} from "netutils";

function SetupFreshConnection(peerConnection, logger, resolver) {
    peerConnection.onicecandidate = e => {
        logger.log("Received icecandidate", e);
        if (!e) {
            logger.error("No ice");
            return;
        }
        if (!e.candidate) {
            resolver.resolve();
        }
    };

    peerConnection.oniceconnectionstatechange = (e) => {
        logger.log("connection statechange", peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === "failed" || peerConnection.iceConnectionState === "disconnected") {
            logger.error("failed iceConnectionState", e);
            // peerConnection.restartIce();
            // candidateAdder.resetCands();
        }
    };

    return peerConnection;
}


export default function createChan(logger) {
    let openPromise = Promise.withResolvers();
    let candPromiseWr = Promise.withResolvers();
    const ready = () => openPromise.promise;
    let pc = new RTCPeerConnection();
    let dataChannel = null;
    let reconnectCounter = 0;
    let initiatorState = 0;

    async function updateOffer() {
        // const offer = await peerConnection.createOffer();
        // await peerConnection.setLocalDescription(offer);
        // logger.log("create offer", offer);
        await pc.setLocalDescription();
        await Promise.race([candPromiseWr.promise, delay(1000)]);
        return pc.localDescription;
    }

    const resetPromises = () => {
        openPromise = Promise.withResolvers();
        candPromiseWr = Promise.withResolvers();
    };

    const resetCands = async () => {
        resetPromises();
        logger.log("Ans reseted", dataChannel.label, pc.iceConnectionState);
        // console.timeLog("reconnect", "reset2");
    };

    function setupDataChannel(isReconnect) {
        dataChannel.onmessage = function (e) {
            logger.log("data get " + e.data);
            const json = JSON.parse(e.data);
            logger.log(json);
        };

        dataChannel.onopen = function () {
            logger.log("------ DATACHANNEL OPENED ------");
            const sctp = pc.sctp;
            const maxMessageSize = sctp.maxMessageSize;
            logger.log("datachanid " + dataChannel.id, dataChannel.label, maxMessageSize);
            openPromise.resolve(dataChannel);
        };

        dataChannel.onclose = function (err) {
            logger.error("------ DC closed! ------", dataChannel.readyState, err);
            ++reconnectCounter;
            console.time("reconnect");
            dataChannel = pc.createDataChannel("chanReconnect" + reconnectCounter);
            setupDataChannel(true);
            initiatorState = 1;
            pc.restartIce();
            resetCands();
        };

        dataChannel.onerror = function (err) {
            logger.error("DC ERROR!!!", dataChannel.readyState, err);
            // peerConnection.restartIce();
            // resetCands();
        };
    }

    const setAnswer = async (data) => {
        const answer = {type: "answer", sdp: data.sdp};
        await pc.setRemoteDescription(answer);
        logger.log("answer", data, answer);
    }

    const setupActive = async () => {
        SetupFreshConnection(pc, logger, candPromiseWr.promise);
        initiatorState = 1;
        const offer = await updateOffer();
        return {offer, setAnswer};
    }

    const setupPassive = async (offerData) => {
        SetupFreshConnection(pc, logger, candPromiseWr.promise);
        initiatorState = 2;
        pc.ondatachannel = (ev) => {
            dataChannel = ev.channel;
            setupDataChannel(ev.channel);
        };
        await pc.setRemoteDescription(offerData);
        const offer = await updateOffer();
        return offer;
    }

    return {
        ready,
        setupActive,
        setupPassive
    }
}
