import Events = require('../Bridge');

import Component = require('./Component');

class FormComponent<T> extends Component {
    protected _marshall: Marshaller<T>;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._marshall = null;

        this.e.submit((event: Event) => {
            this._events.trigger('submit', event, this);
        });
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

    submit(callback: Events.EventBridgeCallback<T>): FormComponent<T> {
        this.addEventListener('submit', (event: Event) => {
            var value: T = null;
            if (this._marshall !== null) {
                value = this._marshall(value);
            }
            callback.call(this, event, value);
        });

        return this;
    }
}

export = FormComponent;
