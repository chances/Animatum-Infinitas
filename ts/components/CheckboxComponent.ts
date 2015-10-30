import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class CheckboxComponent extends InputComponent<boolean> {

    constructor(elementSelector: string);
    constructor(element: HTMLElement);
    constructor(element: any) {
        super(element);

        this.marshaller = (): boolean => {
            return this.checked;
        };

        if (this.element.parentNode && this.e.parentNode.nodeName === 'label') {
            this.element.parentNode.addEventListener('click', () => this.clicked());
        } else {
            this.element.addEventListener('click', () => this.clicked());
        }
    }

    get checked(): boolean {
        let input = <HTMLInputElement>(this.element);
        return input.checked;
    }

    set checked(checked: boolean) {
        if (checked === true) {
            this.attr('checked', 'checked');
        } else {
            this.e.removeAttribute('checked');
        }
        let input = <HTMLInputElement>(this.element);
        input.checked = checked;
    }

    change(callback: Events.BridgeCallback<boolean>): CheckboxComponent {
        this.addEventListener('checkedChanged', (value: boolean) => {
            callback(value);
        });

        return this;
    }

    private clicked(): void {
        this.events.trigger('checkedChanged', this.checked);
        this.triggerChange(this.checked);
    }
}

export = CheckboxComponent;
