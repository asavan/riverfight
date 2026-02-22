
import layer from "./layer.js";

export default function protocol(chan, logger, to) {
    const sender = {
        send: (data) => {
            chan.send("", data, to);
        }
    };
    const topLayer = layer("", logger, sender);
    chan.on("message", (data) => {
        topLayer.onData(data.data);
    });
    return topLayer;
}
