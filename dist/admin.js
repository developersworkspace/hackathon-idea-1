"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsmq_1 = require("wsmq");
function onMessage(channel, data, mqc) {
}
const messageQueueClient = new wsmq_1.MessageQueueClient('ws://wsmq.openservices.co.za', onMessage, []);
messageQueueClient.connect();
function publish(message, title, type) {
    messageQueueClient.send('hackathon-idea-1', {
        message,
        title,
        type,
    });
}
exports.publish = publish;
function publishError(message, title) {
    publish(message, title, 'error');
}
exports.publishError = publishError;
function publishSuccess(message, title) {
    publish(message, title, 'success');
}
exports.publishSuccess = publishSuccess;
function publishWarning(message, title) {
    publish(message, title, 'warning');
}
exports.publishWarning = publishWarning;
function onClickDownloadNowAvailable() {
    publishSuccess(`The file you created called '<a href="#">my-export-1</a>' is now available. You can download it from your <a href="#">My Downloads</a> page, in the My Pages area of Passport.`, `Download now available`);
}
exports.onClickDownloadNowAvailable = onClickDownloadNowAvailable;
function onClickDownloadExpired() {
    publishError(`Your file 'my-export-1' has expired. Click <a href="#">here</a> to recreate it.`, `Download expired`);
}
exports.onClickDownloadExpired = onClickDownloadExpired;
function onClickDownloadExpiringSoon() {
    publishWarning(`Your file 'my-export-1' will be expiring in the next 10 days.`, `Download expiring soon`);
}
exports.onClickDownloadExpiringSoon = onClickDownloadExpiringSoon;
function onClickNewSharedContent() {
    publishSuccess(`Pritam Mohanty has <a href="#">shared new content</a>.`, `New Shared Content`);
}
exports.onClickNewSharedContent = onClickNewSharedContent;
//# sourceMappingURL=admin.js.map