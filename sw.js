const CACHE_NAME = "paint-inventory-v4.6";

const urlsToCache = [
    "index.html",
    "upload-paint.html",
    "paint-inventory.html",
    "build-inventory.html",
    "upload-build.html",
    "style.css",
    "main.js",
    "upload-paint.js",
    "paint-inventory.js",
    "upload-build.js",
    "build-inventory.js",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "images/appBackground.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// Only takes over when the page explicitly tells it to
self.addEventListener("message", function (event) {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});