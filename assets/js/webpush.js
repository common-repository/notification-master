/**
 * WordPress Dependencies
 */
var apiFetch = window.wp.apiFetch;

var WebPushConfig = window['notificationMasterWebpush'] || {};

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Subscribes the user to push notifications.
     *
     * @param registration The service worker registration.
     * @return A promise that resolves to the PushSubscription object.
     */
    function subscribeUserToPush(registration) {
        var vapidPublicKey = WebPushConfig.vapidPublicKey;
        var convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        return registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            })
            .then(function (subscription) {
                sendSubscriptionToServer(subscription);

                return subscription;
            })
            .catch(function (error) {
                // console.error('Failed to subscribe the user: ', error);
            });
    }

    /**
     * Converts a base64 string to a Uint8Array.
     *
     * @param base64String The base64 string.
     * @return The converted Uint8Array.
     */
    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Sends the subscription object to the server.
     *
     * @param subscription The PushSubscription object.
     */
    function sendSubscriptionToServer(subscription) {
        var JSONSubscription = subscription.toJSON();
        var key = JSONSubscription.keys && JSONSubscription.keys.p256dh;
        var token = JSONSubscription.keys && JSONSubscription.keys.auth;
        var expirationTime = JSONSubscription.expirationTime;
        var contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

        apiFetch({
            path: '/ntfm/v1/subscriptions',
            method: 'POST',
            data: {
                endpoint: subscription.endpoint,
                auth: token,
                p256dh: key,
                expirationTime: expirationTime,
                contentEncoding: contentEncoding
            }
        })
            .then(function (response) {
                if (response.success) {
                    toggleButton(true);
                }
            })
            .catch(function (error) {
                // console.error('Failed to send subscription to server:', error);
            });
    }

    /**
     * Removes the subscription object from the server.
     * 
     * @param subscription The PushSubscription object.
     */
    function removeSubscriptionFromServer(subscription) {
        var JSONSubscription = subscription.toJSON();
        var key = JSONSubscription.keys && JSONSubscription.keys.p256dh;
        var token = JSONSubscription.keys && JSONSubscription.keys.auth;

        apiFetch({
            path: '/ntfm/v1/subscriptions/unsubscribe',
            method: 'POST',
            data: {
                endpoint: subscription.endpoint,
                auth: token,
                p256dh: key
            }
        }).then(function (response) {
            if (response.success) {
                toggleButton(false);
            }
        }).catch(function (error) {
            // console.error('Failed to remove subscription from server:', error);
        });

        return subscription;
    }

    function displayPermissionDialog(button = true) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker
                .register(WebPushConfig.serviceWorkerUrl)
                .then(function (registration) {
                    // Ask for permission to send notifications
                    return Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            subscribeUserToPush(registration);
                        } else {
                            if (button) {
                                toggleButton(false);
                                alert('You have denied the permission to send notifications. Please allow it to subscribe to push notifications.');
                            }
                        }
                    });
                })
                .catch(function (error) {
                    // console.error('Service Worker registration failed:', error);
                });
        } else {
            if (button) {
                alert('Your browser does not support push notifications, if you are using iPhone/iPad, please add this website to your home screen to receive notifications.');
            }
        }
    }

    function unsubscribeUser() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker
                .register(WebPushConfig.serviceWorkerUrl)
                .then(function (registration) {
                    // Ask for permission to send notifications
                    return Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            return registration.pushManager.getSubscription().then(function (subscription) {
                                if (subscription) {
                                    removeSubscriptionFromServer(subscription);
                                } else {
                                    toggleButton(false);
                                }
                            });
                        }
                    });
                })
                .catch(function (error) {
                    // console.error('Service Worker registration failed:', error);
                });
        }
    }

    function checkSubscriptionOnServer(subscription) {
        apiFetch({
            path: '/ntfm/v1/subscriptions/check-status',
            method: 'POST',
            data: {
                endpoint: subscription.endpoint,
            }
        }).then(function (response) {
            if (response.status === 'subscribed') {
                toggleButton(true);
            } else {
                toggleButton(false);
            }
        }).catch(function (error) {
            // console.error('Failed to check subscription on server:', error);
        });
    }

    function checkServerStatus() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker
                .register(WebPushConfig.serviceWorkerUrl)
                .then(function (registration) {
                    return registration.pushManager.getSubscription().then(function (subscription) {
                        if (subscription) {
                            checkSubscriptionOnServer(subscription);
                        } else {
                            toggleButton(false);
                        }
                    });
                })
                .catch(function (error) {
                    // console.error('Service Worker registration failed:', error);
                });
        }
    }


    function toggleButton(subscribed = false) {
        var subscribeButtons = document.querySelectorAll('.notification-master-subscribe');
        var unsubscribeButtons = document.querySelectorAll('.notification-master-unsubscribe');

        if (subscribeButtons.length > 0 && unsubscribeButtons.length > 0) {
            if (subscribed) {
                subscribeButtons.forEach(function (button) {
                    button.style.display = 'none';
                });
                unsubscribeButtons.forEach(function (button) {
                    button.style.display = 'flex';
                });
            } else {
                subscribeButtons.forEach(function (button) {
                    button.style.display = 'flex';
                });
                unsubscribeButtons.forEach(function (button) {
                    button.style.display = 'none';
                });
            }
        }
    }

    var subscribeButtons = document.querySelectorAll('.notification-master-subscribe');

    if (subscribeButtons.length) {
        subscribeButtons.forEach(function (button) {

            button.addEventListener('click', function () {
                toggleButton(true);
                displayPermissionDialog();
            });
        });
    }

    var unsubscribeButtons = document.querySelectorAll('.notification-master-unsubscribe');

    if (unsubscribeButtons.length) {
        unsubscribeButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                toggleButton(false);
                unsubscribeUser();
            });
        });
    }

    if (WebPushConfig.automaticPrompt) {
        var clicked = false;

        document.addEventListener('click', function (e) {
            // Check if the user has clicked on a subscribe button

            if (e.target.classList && e.target.classList.contains('notification-master-subscribe')) {
                return;
            }

            if (!clicked) {
                displayPermissionDialog();
                clicked = true;
            }
        });
    }

    if ('Notification' in window) {
        var permission = Notification.permission;

        if (permission === 'granted') {
            toggleButton(true);
            checkServerStatus();
        }
    }
});
