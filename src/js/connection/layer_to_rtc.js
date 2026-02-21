import layer from "./layer.js";


export default async function protocol(chan, logger) {
    const topLayer = layer("", logger);
    const dataChan = await chan.ready();
    if (dataChan) {

    }
}
