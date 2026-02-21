export default function layer(action, logger) {
    const handlers = {};
    const getAction = () => action;

    const onData = (data) =>  {
        for (const key of Object.keys(data)) {
            const handle = handlers[key];
            if (handle) {
                if (typeof handle === "function") {
                    handle(data[key]);
                } else if (handle.onData) {
                    handle.onData(data[key]);
                }
            } else {
                logger.log("No handle " + key);
            }
        }
    }

    const registerAction = (act, handle) => {
        handlers[act] = handle;
    };

    const send = (data, sender) => {
        if (!action) {
            sender.send(data);
            return;
        }
        const toSend = {}
        toSend[action] = data;
        sender.send(toSend);
    }

    const waitForData = (act) => {
        const prWr = Promise.withResolvers();
        registerAction(act, (data) => {
            prWr.resolve(data);
        });
        return prWr.promise;
    }

    return {
        getAction,
        registerAction,
        onData,
        waitForData,
        send
    }
}
