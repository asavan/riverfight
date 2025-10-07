import settings from "../src/js/settings.js";
import {wsServer} from "netdeps";
wsServer(settings.wsPort);
