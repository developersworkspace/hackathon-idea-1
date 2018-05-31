import * as toastr from 'toastr';
import { MessageQueueClient } from 'wsmq';

function onMessage(channel: string, data: any, mqc: MessageQueueClient): void {
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

const messageQueueClient: MessageQueueClient = new MessageQueueClient('wss://wsmq.openservices.co.za', onMessage, [
    'hackathon-idea-1',
]);

messageQueueClient.connect();
