function getWebSocketUrl(protocol, socketUrl, host, settings) {
    if (socketUrl) {
        return socketUrl;
    }
    if (protocol === "https:") {
        return;
    }
    return "ws://" + host + ":" + settings.wsPort;
}

export function getSocketUrl(location, settings) {
    return getWebSocketUrl(location.protocol, settings.wh, location.hostname, settings);
}

export function getStaticUrl(location, settings) {
    return settings.sh || location.origin;
}
