function stringToBoolean(string) {
    switch (string.toLowerCase().trim()) {
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": case null: return false;
    default: return Boolean(string);
    }
}

export function parseSettings(queryString, settings) {
    const urlParams = new URLSearchParams(queryString);
    const changed = [];
    for (const [key, value] of urlParams) {
        if (typeof settings[key] === "number") {
            settings[key] = Number.parseInt(value, 10);
        } else if (typeof settings[key] === "boolean") {
            settings[key] = stringToBoolean(value);
        } else {
            settings[key] = value;
        }
        changed.push(key);
    }
    return changed;
}
