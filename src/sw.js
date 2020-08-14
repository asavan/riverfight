const CACHE = 'offline-fallback';
self.addEventListener('install', function (evt) {
    evt.waitUntil(precache().then(function () {
        return self.skipWaiting();
    }));
});

self.addEventListener('activate', function (evt) {
    evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(networkOrCache(evt.request).catch(function () {
        return useFallback();
    }));
});


function networkOrCache(request) {
    return fetch(request).then(function (response) {
        return response.ok ? response : fromCache(request);
    })
        .catch(function () {
            return fromCache(request);
        });
}

function useFallback() {
    return caches.open(CACHE).then(function(cache) {
        return cache.match('./');
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('request-not-in-cache');
        });
    });
}

function precache() {
    const filesToCache  = self.__WB_MANIFEST.map((e) => e.url);
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            "./",
            "./manifest.json",
            "./assets/maskable_icon.png",
            "./assets/192.png",
            "./assets/512.png",
            "./assets/boat7.svg",
            "./assets/bloop.mp3",
            "./assets/windows-98-sound-tada.mp3",
            ...filesToCache
        ]);
    });
}
