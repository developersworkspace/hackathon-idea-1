"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toastr = require("toastr");
const wsmq_1 = require("wsmq");
function onMessage(channel, data, mqc) {
    switch (data.type) {
        case 'error':
            toastr.error(data.message, data.title, { timeOut: 10000 });
            break;
        case 'success':
            toastr.success(data.message, data.title, { timeOut: 10000 });
            break;
        case 'warning':
            toastr.warning(data.message, data.title, { timeOut: 10000 });
            break;
    }
}
const messageQueueClient = new wsmq_1.MessageQueueClient('wss://wsmq.openservices.co.za', onMessage, [
    'hackathon-idea-1',
]);
messageQueueClient.connect();
//# sourceMappingURL=main.js.map