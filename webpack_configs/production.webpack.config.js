import path from "path";
import { fileURLToPath } from "url";

import PACKAGE from "../package.json" with { type: "json" };
import {webpackProd} from "devdeps";
import commonCopy from "./common_import.js";

const prodConfig = () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return webpackProd(PACKAGE.version, dirname, commonCopy);
};

export default prodConfig;
