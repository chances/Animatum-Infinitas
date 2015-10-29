import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class TextboxComponent extends InputComponent<string> {
    private textValue: string;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._marshall = InputComponent.StringMarshaller;

        this.textValue = <HTMLInputElement>(this.element).value;

        this.keyup(() => {
            this.checkTextChanged(<HTMLInputElement>(this.element).value);
        });
    }

    get text() {
        return this.textValue;
    }

    set text(value: string) {
        this.textValue = value;
        <HTMLInputElement>(this.element).value = value;
    }

    private checkTextChanged(value: string) {
        if (this.textValue !== value) {
            this.textValue = value;
            this.triggerChange(value);
        }
    }
}

export = TextboxComponent;
