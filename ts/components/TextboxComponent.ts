import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class TextboxComponent extends InputComponent<string> {
    private _text: string;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._marshall = InputComponent.StringMarshaller;

        this._text = "";

        super.change((value: string) => {
            this.checkTextChanged(value);
        });

        this.keyup(() => {
            this.checkTextChanged(this.e.val());
        });
    }

    get text() {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        this.e.val(value);
    }

    change(callback: Events.BridgeCallback<string>): TextboxComponent {
        this.addEventListener('textChanged', (value: string) => {
            callback(value);
        });

        return this;
    }

    private checkTextChanged(value: string) {
        if (this._text !== value) {
            this._text = value;
            this._events.trigger('textChanged', value);
        }
    }
}

export = TextboxComponent;
