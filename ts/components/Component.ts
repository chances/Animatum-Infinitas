import Events = require('../Bridge');

class Component {
    protected _element: ZeptoFxCollection;
    protected _events: Events.Bridge;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        this._element = <ZeptoFxCollection>$(element);
        this._events = new Events.Bridge();

        this.e.keyup((data: KeyboardEvent) => {
            this._events.trigger('keyup', data);
        });
    }

    get e(): ZeptoFxCollection {
        return this._element;
    }

    get id(): string {
        return this._element.attr('id');
    }

    get width(): number {
        return this._element.width();
    }

    get height(): number {
        return this._element.height();
    }

    addEventListener(event: string, callback: Events.BridgeCallback<any>): number {
        return this._events.on(event, callback);
    }

    on(event: string, callback: Events.BridgeCallback<any>): Component {
        this._events.on(event, callback);

        return this;
    }

    removeEventListener(id: number): void;
    removeEventListener(callback: Events.BridgeCallback<any>): void;
    removeEventListener(idOrCallback: any): void {
        this._events.off(idOrCallback);
    }

    off(id: number): Component;
    off(callback: Events.BridgeCallback<any>): Component;
    off(idOrCallback: any): Component {
        this._events.off(idOrCallback);

        return this;
    }

    data(name: string): string;
    data(name: string, value: string): Component;
    data(name: string, value?: string): any {
        if (value === undefined) {
            var str:string = this.e.attr('data-' + name);
            if (str !== '') return str;
        } else {
            this.e.attr('data-' + name, value);
        }

        return this;
    }

    show(fade: boolean = false, duration: number = $.fx.speeds._default) {
        if (fade) {
            this.e.fadeIn(duration);
        } else {
            this.e.show();
        }
    }

    hide(fade: boolean = false, duration: number = $.fx.speeds._default) {
        if (fade) {
            this.e.fadeOut(duration);
        } else {
            this.e.hide();
        }
    }

    keyup(callback: Events.BridgeCallback<KeyboardEvent>): Component {
        this.on('keyup', callback);

        return this;
    }
}

export = Component;
