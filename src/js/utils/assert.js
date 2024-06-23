export function assert(b, message) {
    if (b) {
        return;
    }
    console.error(message);
    console.trace(message);
    throw message;
}
