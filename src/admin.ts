import { MessageQueueClient } from 'wsmq';

function onMessage(channel: string, data: any, mqc: MessageQueueClient): void {

}

const messageQueueClient: MessageQueueClient = new MessageQueueClient('ws://wsmq.openservices.co.za', onMessage, []);

messageQueueClient.connect();

export function publish(message: string, title: string, type: string): void {
    messageQueueClient.send('hackathon-idea-1', {
        message,
        title,
        type,
    });
}

export function publishError(message: string, title: string): void {
    publish(message, title, 'error');
}

export function publishSuccess(message: string, title: string): void {
    publish(message, title, 'success');
}

export function publishWarning(message: string, title: string): void {
    publish(message, title, 'warning');
}

export function onClickDownloadNowAvailable(): void {
    publishSuccess(`The file you created called '<a href="#">my-export-1</a>' is now available. You can download it from your <a href="#">My Downloads</a> page, in the My Pages area of Passport.`, `Download now available`);
}

export function onClickDownloadExpired(): void {
    publishError(`Your file 'my-export-1' has expired. Click <a href="#">here</a> to recreate it.`, `Download expired`);
}

export function onClickDownloadExpiringSoon(): void {
    publishWarning(`Your file 'my-export-1' will be expiring in the next 10 days.`, `Download expiring soon`);
}

export function onClickNewSharedContent(): void {
    publishSuccess(`Pritam Mohanty has <a href="#">shared new content</a>.`, `New Shared Content`);
}
