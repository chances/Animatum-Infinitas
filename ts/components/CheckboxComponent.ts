import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class CheckboxComponent extends InputComponent<boolean> {
    private _step: number;

    constructor(elementSelector:string);
    constructor(element:HTMLElement);
    constructor(element:any) {
        super(element);

        this.marshaller = (): boolean => {
            return this.checked;
        };

        this._step = 0;

        this.e.change(() => {
            this._step = this._step === 0 ? 1 : 0;
        });

        if (this.e.parent().is('label')) {
            this.e.parent().click(() => { this.clicked(); });
        } else {
            this.e.click(() => { this.clicked() });
        }
    }

    get checked() {
        return this.e.hasAttr('checked') && this.e.is(':checked');
    }

    set checked(checked: boolean) {
        if (checked === true) {
            this.e.attr('checked', '');
        } else {
            this.e.removeAttr('checked');
        }
    }

    change(callback: Events.BridgeCallback<boolean>): CheckboxComponent {
        this.addEventListener('checkedChanged', (value: boolean) => {
            callback(value);
        });

        return this;
    }

    private clicked() {
        this._step = this._step === 1 ? 2 : 0;
        this.checkedChanged();
    }

    private checkedChanged() {
        this._step = this._step === 2 ? 3 : 0;
        if (this._step === 3) {
            this._events.trigger('checkedChanged', this.checked);
            this._step = 0;
        }
    }
}

export = CheckboxComponent;
