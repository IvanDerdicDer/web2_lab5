//file -> public/sw.js

const CACHE_NAME = "cache-v1";
const assetToCache = [
    "/page",
    "/",
    "/manifest.json",
    "/javascripts/recorder.js",
    "/sw.js",
    "/stylesheets/style.css",
    "/icon.png",
    "/favicon.ico"
];
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(assetToCache);
            })
            .catch(console.error)
    );
});

self.addEventListener('push', event => {
    const notificationData = event.data.json();
    const title = notificationData.title;
    const options = {
        body: notificationData.body,
        // You can add additional options here, such as a custom icon or sound
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response.status === 404) {
                return "ERROR";
            }

            if (response){
                return response
            }

            const fetch_promise = fetch(event.request).then((network_response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request.url, network_response.clone())
                    return network_response
                })
            })

            return response || fetch_promise
        })
    );
});
