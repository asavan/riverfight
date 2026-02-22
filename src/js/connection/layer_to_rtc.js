import layer from "./layer.js";


export default function protocol(dataChan, logger) {
    if (!dataChan) {
        logger.error("No chan");
        return;
    }
    const sender = {
        send : (data) => {
            const str = JSON.stringify(data);
            dataChan.send(str);
        }
    };
    const topLayer = layer("", logger, sender);
    dataChan.onmessage = (data) => {
        const obj = JSON.parse(data);
        topLayer.onData(obj);
    };
    return topLayer;
}
