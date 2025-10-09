import commonCopy from "./common_import.js";
import { webpackDev } from "devdeps";

const devConfig = () => webpackDev(commonCopy);
export default devConfig;
