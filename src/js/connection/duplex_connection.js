import {createSignalingChannel, netObj, loggerFunc, delay} from "netutils";
import protocolBroad from "../connection/layer_to_broad_chan.js";
import protocolRtc from "../connection/layer_to_rtc.js";
import createChan from "../connection/webrtc.js";

export default async function duplexConnection(window, document, settings) {
    const myId = netObj.getMyId(window, settings, Math.random);
    const networkLogger = loggerFunc(document, settings);
    const rtcLogger = loggerFunc(document, settings);
    const gameChannelPromise = createSignalingChannel(myId, null, window.location, settings, networkLogger);
    // logger.log(gameChannelPromise);
    const gameChannel = await gameChannelPromise;
    const sigNet = protocolBroad(gameChannel, networkLogger, "all");
    const rtcNet = sigNet.subLayer("rtc");
    const offerPromise = rtcNet.waitForData("offer");
    rtcNet.send({"join": {"id": myId}});
    const offerData = await Promise.race([offerPromise, delay(500)]);
    const rtcChan = createChan(rtcLogger);
    if (offerData) {
        const answer = await rtcChan.setupPassive(offerData);
        rtcNet.send({answer});
    } else {
        const joinWaiter = rtcNet.waitForData("join");
        const data = await rtcChan.setupActive();
        const joinData = await joinWaiter;
        rtcLogger.log(joinData);
        const answerWaiter = rtcNet.waitForData("answer");
        rtcNet.send({offer: data.offer});
        const answerData = await answerWaiter;
        await data.setAnswer(answerData);
    }
    const dataChan = await rtcChan.ready();
    const rtcChanNet = protocolRtc(dataChan, rtcLogger);
    networkLogger.log(rtcChanNet);
}
