if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log(`service worker registered succesfully ${registration.toString()}`)
            })
            .catch((err) => {
                console.log(`Error registring ${err}`)
            })
    })
} else {
    console.log(`Service worker is not supported in this browser.`)
}

if ('PeriodicSyncManager' in window) {
    navigator.serviceWorker.ready.then(serviceWorker => {
        // Request permission to use the background sync feature
        navigator.permissions.query({name: 'periodic-background-sync'})
            .then(permissionStatus => {
                if (permissionStatus.status === 'granted') {
                    // The user has granted permission to use the background sync feature
                    serviceWorker.periodicSync.register('call_random', {
                        minInterval: 10 * 1000 // Run every hour
                    }).then(syncRegistration => {
                        console.log(syncRegistration)
                    }).catch(error => {
                        console.log(error)
                    });
                } else {
                    console.log("No permission")
                }
            });
    });
}
