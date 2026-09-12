const CACHE_NAME = "paint-inventory-v0.1";

const urlsToCache = [
    "/index.html",
    "/upload-paint.html",
    "/paint-inventory.html",
    "/style.css",
    "/main.js",
    "/upload-paint.js",
    "/paint-inventory.js"
];

// Runs once when the service worker is first installed
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// Intercepts every network request the page makes
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Serve from cache if available, otherwise fetch from network
            return response || fetch(event.request);
        })
    );
});

// Cleans up old caches when you deploy a new version
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
        })
    );
});