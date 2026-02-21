import {makeQrElement} from "netutils";

function chomp(string, c) {
    if (string.endsWith(c)) {
        return string.slice(0, -c.length);
    }
    return string;
}

export function removeElem(el) {
    if (el) {
        el.remove();
    }
}

export function makeQrPlainEl(staticHost, el, pic = "./assets/boat7.svg") {
    const url = new URL(staticHost);
    const urlStr = chomp(url.toString(), "/");
    console.log("enemy url", urlStr);
    const image = {
        source: pic,
            width: "20%",
            height: "15%",
            x: "center",
            y: "center",
    };
    return makeQrElement(urlStr, el, image);
}
