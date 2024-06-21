/* eslint-env serviceworker */

const version = __SERVICE_WORKER_VERSION__;
const CACHE = "cache-only-" + version;

self.addEventListener("install", (evt) => {
    evt.waitUntil(precache().then(() => self.skipWaiting()));
});

const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = [CACHE];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
};

const deleteAndClaim = async () => {
    await deleteOldCaches();
    await self.clients.claim();
};

self.addEventListener("activate", (event) => {
    event.waitUntil(deleteAndClaim());
});

self.addEventListener("fetch", (evt) => {
    evt.respondWith(networkOrCache(evt.request));
});

function networkOrCache(request) {
    return fetch(request).then((response) => {
        if (response.ok) {
            return response;
        }
        return fromCache(request);
    })
        .catch(() => fromCache(request));
}

async function fromCache(request) {
    const cache = await caches.open(CACHE);
    const matching = await cache.match(request, { ignoreSearch: true });
    if (matching) {
        return matching;
    }
    throw new Error("request-not-in-cache");
}

const filesToCache = self.__WB_MANIFEST.map((e) => e.url);
async function precache() {
    const cache = await caches.open(CACHE);
    return await cache.addAll([
        "./",
        ...filesToCache
    ]);
}
