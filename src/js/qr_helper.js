import { QRCodeSVG } from "@akamfoad/qrcode";

export function bigPicture(elem) {
    elem.addEventListener("click", () => elem.classList.toggle("big"));
}

function chomp(string, c) {
    if (string.charAt(string.length - c.length) === c) {
        return string.substr(0, string.length - c.length);
    }
    return string;
}

function renderQRCodeSVG(text, divElement, pic) {
    const qrSVG = new QRCodeSVG(text, {
        level: "M",
        padding: 3,
        image: {
            source: pic,
            width: "20%",
            height: "15%",
            x: "center",
            y: "center",
        },
    });
    divElement.innerHTML = qrSVG.toString();
    bigPicture(divElement);
    return divElement;
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
    return renderQRCodeSVG(urlStr, el, pic);
}

export function makeQrPlain(staticHost, document, selector) {
    return makeQrPlainEl(staticHost, document.querySelector(selector));
}

export function makeQr(window, document, settings) {
    const staticHost = settings.sh || window.location.origin;
    return makeQrPlain(staticHost, document, ".qrcode");
}
