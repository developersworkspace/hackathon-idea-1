"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toastr = require("toastr");
const wsmq_1 = require("wsmq");
function onMessage(channel, data, mqc) {
    showBrowserNotification(data.message, data.title, data.type);
}
function showBrowserNotification(message, title, type) {
    if (!('Notification' in window)) {
        return;
    }
    else if (Notification.permission === 'granted') {
        const notification = new Notification(title);
    }
    else if (Notification.permission !== 'default' || Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
            if (permission === 'granted') {
                const notification = new Notification(title);
            }
        });
    }
}
function showToastNotification(message, title, type) {
    switch (type) {
        case 'error':
            toastr.error(message, title, { timeOut: 10000 });
            break;
        case 'success':
            toastr.success(message, title, { timeOut: 10000 });
            break;
        case 'warning':
            toastr.warning(message, title, { timeOut: 10000 });
            break;
    }
}
const messageQueueClient = new wsmq_1.MessageQueueClient('ws://wsmq.openservices.co.za', onMessage, [
    'hackathon-idea-1',
]);
messageQueueClient.connect();
//# sourceMappingURL=main.js.map