import InputComponent = require('./InputComponent');

class TextboxComponent extends InputComponent<string> {
    private textValue: string;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        let input = <HTMLInputElement>this.element;

        this._marshall = InputComponent.StringMarshaller;

        this.textValue = input.value;

        this.keyup(() => {
            this.checkTextChanged(input.value);
        });
    }

    get text(): string {
        return this.textValue;
    }

    set text(value: string) {
        let input = <HTMLInputElement>this.element;
        this.textValue = value;
        input.value = value;
    }

    private checkTextChanged(value: string): void {
        if (this.textValue !== value) {
            this.textValue = value;
            this.triggerChange(value);
        }
    }
}

export = TextboxComponent;
