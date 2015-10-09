import Component = require('./Component');

class EnableableComponent extends Component {
    private _enabled: boolean;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._enabled = this.e.hasAttr('disabled');
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(enabled: boolean) {
        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    enable(): EnableableComponent {
        this.e.removeAttr('disabled');
        this._enabled = true;

        return this;
    }

    disable(): EnableableComponent {
        this.e.attr('disabled', '');
        this._enabled = false;

        return this;
    }
}

export = EnableableComponent;
