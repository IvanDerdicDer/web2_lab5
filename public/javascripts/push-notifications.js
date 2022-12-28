// First, check if the browser supports the Push API and the Notifications API
/*if ('PushManager' in window && 'Notification' in window) {
    // Next, check if the user has granted permission to send push notifications
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            // If the user has granted permission, get a push subscription
            navigator.serviceWorker
                .getRegistration()
                .then((registration) => {
                    registration.pushManager
                        .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: "BOe_LmwxtiiKUXPtfNHOuPvSQb7tyukYBIjmGg8Q5tSQQ84Syr30pdLwdQuFRrCaqphzgriwHxDta2lBAnqLWok"
                        })
                        .then((subscription) => {
                            // At this point, you can send the push notification using the subscription object
                            fetch('/saveSubscription', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                },
                                body: JSON.stringify({subscription})
                            })
                                .then(() => {
                                    console.log(subscription)
                                })
                                .catch((error) => {
                                    console.log(error)
                                })

                        })
                        .catch((error) => {
                            console.log('Subscribe error')
                            console.log(error)
                        });
                });
        }
    });
}
*/


async function setupPushSubscription() {
    try {
        let reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (sub === null) {
            let publicKey = "BOe_LmwxtiiKUXPtfNHOuPvSQb7tyukYBIjmGg8Q5tSQQ84Syr30pdLwdQuFRrCaqphzgriwHxDta2lBAnqLWok";
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            });
            let res = await fetch("/saveSubscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({sub}),
            });
            if (res.ok) {
                alert("Yay, subscription generated and saved:\n" +
                    JSON.stringify(sub.toJSON()));
            } else {
                await sub.unsubscribe()
            }
        } else {
            alert("You are alreay subscribed");
        }
    } catch (error) {
        console.log(error);
    }
}

Notification.requestPermission(async function (res) {
        if (res === "granted") {
            await setupPushSubscription();
        } else {
            console.log("User denied push notifs:", res);
        }
    }
)
