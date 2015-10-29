import Events = require('../Bridge');

import EnableableComponent = require('./EnableableComponent');

class InputComponent<T> extends EnableableComponent {
    protected _marshall: Marshaller<T>;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._marshall = null;
    }

    static get NumberMarshaller(): Marshaller<number> {
        return function (value: any): number {
            return parseInt(value, 10);
        };
    }

    static get BooleanMarshaller(): Marshaller<boolean> {
        return function (value: any): boolean {
            return value !== "" && value !== "false" && value !== "n" && value !== "no";
        };
    }

    static get StringMarshaller(): Marshaller<string> {
        return function (value: any): string {
            return value.toString();
        };
    }

    set marshaller(marshaller: Marshaller<T>) {
        this._marshall = marshaller;
    }

    change(callback: Events.BridgeCallback<T>): InputComponent<T> {
        this.addEventListener('change', (value: any) => {
            if (this._marshall !== null) {
                value = this._marshall(value);
            }
            callback.call(this, value);
        });

        return this;
    }

    protected triggerChange(value: any) {
        this.events.trigger('change', value, this);
    }
}

export = InputComponent;
