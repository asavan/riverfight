import {loggerFunc} from "netutils";
import duplexConnection from "../connection/duplex_connection.js";

export default async function netTest(window, document, settings, trans) {
    const gameName = await trans.t("game");
    const logger = loggerFunc(document, settings);
    logger.log(gameName);
    await duplexConnection(window, document, settings);
}
