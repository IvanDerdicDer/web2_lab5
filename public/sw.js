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

self.addEventListener('push', function(event) {
    var notificationTitle = 'My App';
    var notificationOptions = {
        body: 'SW registered',
        icon: '/icon.png',
        data: {
            url: '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});


self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url);
                }
            })
    );
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
