(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Admin = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsmq_1 = require("wsmq");
function onMessage(channel, data, mqc) {
}
const messageQueueClient = new wsmq_1.MessageQueueClient('wss://wsmq.openservices.co.za', onMessage, []);
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
    publishSuccess(`The file you created called '<a target="_blank" href="https://example.com">my-export-1</a>' is now available. You can download it from your <a href="#">My Downloads</a> page, in the My Pages area of Passport.`, `Download now available`);
}
exports.onClickDownloadNowAvailable = onClickDownloadNowAvailable;
function onClickDownloadExpired() {
    publishError(`Your file 'my-export-1' has expired. Click <a target="_blank" href="https://example.com">here</a> to recreate it.`, `Download expired`);
}
exports.onClickDownloadExpired = onClickDownloadExpired;
function onClickDownloadExpiringSoon() {
    publishWarning(`Your file 'my-export-1' will be expiring in the next 10 days.`, `Download expiring soon`);
}
exports.onClickDownloadExpiringSoon = onClickDownloadExpiringSoon;
function onClickNewSharedContent() {
    publishSuccess(`Pritam Mohanty has <a target="_blank" href="https://example.com">shared new content</a>.`, `New Shared Content`);
}
exports.onClickNewSharedContent = onClickNewSharedContent;

},{"wsmq":7}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publish_1 = require("../commands/publish");
const subscribe_1 = require("../commands/subscribe");
class CommandBuilder {
    constructor() {
    }
    build(obj) {
        switch (obj.type) {
            case 'publish':
                return new publish_1.PublishCommand(obj.channel, obj.data);
            case 'subscribe':
                return new subscribe_1.SubscribeCommand(obj.channel);
            default:
                throw new Error('Unsupported Command');
        }
    }
}
exports.CommandBuilder = CommandBuilder;

},{"../commands/publish":5,"../commands/subscribe":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(channel, type) {
        this.channel = channel;
        this.type = type;
    }
}
exports.Command = Command;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class PublishCommand extends command_1.Command {
    constructor(channel, data) {
        super(channel, 'publish');
        this.data = data;
    }
}
exports.PublishCommand = PublishCommand;

},{"./command":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class SubscribeCommand extends command_1.Command {
    constructor(channel) {
        super(channel, 'subscribe');
    }
}
exports.SubscribeCommand = SubscribeCommand;

},{"./command":4}],7:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./builders/command-builder"));
__export(require("./commands/command"));
__export(require("./commands/publish"));
__export(require("./commands/subscribe"));
__export(require("./models/message-queue-client-connection"));
__export(require("./message-queue-client"));

},{"./builders/command-builder":3,"./commands/command":4,"./commands/publish":5,"./commands/subscribe":6,"./message-queue-client":8,"./models/message-queue-client-connection":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const command_builder_1 = require("./builders/command-builder");
const publish_1 = require("./commands/publish");
const subscribe_1 = require("./commands/subscribe");
class MessageQueueClient {
    constructor(host, onMessageFn, subscribedChannels) {
        this.host = host;
        this.onMessageFn = onMessageFn;
        this.subscribedChannels = subscribedChannels;
        this.socket = null;
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (typeof (WebSocket) === 'function') {
                this.socket = new WebSocket(this.host);
            }
            if (typeof (WebSocket) === 'object') {
                this.socket = new window.WebSocket(this.host);
            }
            this.socket.onclose = (closeEvent) => this.onClose(closeEvent);
            this.socket.onmessage = (event) => this.onMessage(event);
            this.socket.onopen = (openEvent) => this.onOpen(openEvent, resolve);
        });
    }
    send(channel, data) {
        this.socket.send(JSON.stringify(new publish_1.PublishCommand(channel, data)));
    }
    onClose(closeEvent) {
        if (closeEvent.code === 1000) {
            return;
        }
        this.connect();
    }
    onMessage(event) {
        const commandBuilder = new command_builder_1.CommandBuilder();
        const command = commandBuilder.build(JSON.parse(event.data));
        if (command instanceof publish_1.PublishCommand) {
            const publishCommand = command;
            if (this.onMessageFn) {
                this.onMessageFn(publishCommand.channel, publishCommand.data, this);
            }
        }
    }
    onOpen(event, callback) {
        if (this.socket.readyState === 1) {
            for (const channel of this.subscribedChannels) {
                const subscribeCommand = new subscribe_1.SubscribeCommand(channel);
                this.socket.send(JSON.stringify(subscribeCommand));
            }
            callback();
        }
    }
}
exports.MessageQueueClient = MessageQueueClient;

},{"./builders/command-builder":3,"./commands/publish":5,"./commands/subscribe":6,"ws":1}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageQueueClientConnection {
    constructor(socket, subscribedChannels) {
        this.socket = socket;
        this.subscribedChannels = subscribedChannels;
    }
    subscribe(channel) {
        this.subscribedChannels.push(channel);
    }
}
exports.MessageQueueClientConnection = MessageQueueClientConnection;

},{}]},{},[2])(2)
});
