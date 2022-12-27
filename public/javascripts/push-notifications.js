// First, check if the browser supports the Push API and the Notifications API
if ('PushManager' in window && 'Notification' in window) {
    // Next, check if the user has granted permission to send push notifications
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            // If the user has granted permission, get a push subscription
            navigator.serviceWorker.getRegistration().then(registration => {
                registration.pushManager.subscribe({ userVisibleOnly: true }).then(subscription => {
                    // At this point, you can send the push notification using the subscription object
                    sendPushNotification(subscription);
                });
            });
        }
    });
}

// This function sends the push notification
function sendPushNotification(subscription) {
    // You'll need to figure out how to get the notification data (e.g., title, body)
    // For the purposes of this example, we'll just use some hard-coded values
    const notificationData = {
        title: 'Notification',
        body: 'You\'ve got notification!',
    };

    // Use the fetch API to send the push notification
    fetch(subscription.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
    });
}

// Finally, to display the notification to the user, you can use the Notifications API
function showNotification(title, body) {
    new Notification(title, { body });
}

// Add an event listener to the button to send the push notification when clicked
const button = document.getElementById('send-notification-button');
button.addEventListener('click', () => {
    sendPushNotification();
});
