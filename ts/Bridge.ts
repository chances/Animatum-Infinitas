import Helpers = require('./Helpers');

export class Bridge {

    private handlers: BridgeHandler[];

    constructor () {
        this.handlers = [];
    }

    /**
     * Add and subscribe to an event
     * @param event Type of bridge event to handle
     * @param callback Handling callback delegate
     * @return Unique id representing this event
     */
    on(event: string, callback: BridgeCallback<any>): number {
        Math.random();
        var handler: BridgeHandler = {
            event: event,
            id: Helpers.randomNumber(0, Date.now()),
            callback: callback
        };
        this.handlers.push(handler);
        return handler.id;
    }

    /**
     * Remove an event handler
     * @param id Unique id representing the event to remove
     */
    off(id: number): Bridge;
    /**
     * Remove an event handler
     * @param callback Function callback assigned to the event to remove
     */
    off(callback: BridgeCallback<any>): Bridge;
    off(idOrCallback: any): Bridge {
        var index = -1;
        for (var i = 0; i < this.handlers.length; i++) {
            if (typeof idOrCallback === 'number') {
                if (this.handlers[i].id === idOrCallback) {
                    index = i;
                    break;
                }
            } else {
                if (this.handlers[i].callback === idOrCallback) {
                    index = i;
                    break;
                }
            }
        }
        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
        return this;
    }

    /**
     * Dispatch an event
     * @param event Type of bridge event to dispatch
     * @param data Data to pass along to event handlers
     * @param context=window Context in which to execute handling callback delegates
     */
    trigger(event: string, data: any = null, context: any = window): Bridge {
        this.handlers.forEach(function (handler: BridgeHandler) {
            if (handler.event === event) {
                if (data === null) {
                    handler.callback.call(context);
                } else {
                    handler.callback.call(context, data);
                }
            }
        });
        return this;
    }
}

declare class BridgeHandler {
    event: string;
    id: number;
    callback: BridgeCallback<any>;
}

export interface BridgeCallback<T> {
    (data?: T): void;
    (data?: any): void;
}

export interface EventBridgeCallback<T> {
    (event: Event, data?: T): void;
    (event: Event, data?: any): void;
}
