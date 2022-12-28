//file -> public/sw.js

const CACHE_NAME = "cache-v1";
const assetToCache = [
    "/page",
    "/",
    "/manifest.json",
    "/javascripts/recorder.js",
    "/javascripts/push-notifications.js",
    "/sw.js",
    "/stylesheets/style.css",
    "/icon.png",
    "/favicon.ico"
];
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
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

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response && response.status === 404) {
                return "ERROR";
            }

            const fetch_promise = fetch(event.request)
                .then((network_response) => {
                    return caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request.url, network_response.clone())
                            return network_response
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })

            return response || fetch_promise
        })
    );
});

self.addEventListener('periodicSync', event => {
    if(!navigator.onLine){
        console.log('Periodic Sync aborted. App is offline')
        return
    }
    if (event.tag === 'call_random') {
        event.waitUntil(fetch('/random'))
    }
});
