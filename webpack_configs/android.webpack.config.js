import path from "path";
import { fileURLToPath } from "url";

import {webpackAndroid} from "devdeps";
import commonCopy from "./common_import.js";

const aConfig = () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return webpackAndroid(dirname, commonCopy);
};

export default aConfig;
