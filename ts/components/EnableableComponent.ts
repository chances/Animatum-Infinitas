import Component = require('./Component');

class EnableableComponent extends Component {

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);
    }

    get enabled() {
        return this.element.hasAttribute('disabled');
    }

    set enabled(enabled: boolean) {
        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    }

    enable(): EnableableComponent {
        this.e.removeAttribute('disabled');
        this.enabled = true;

        return this;
    }

    disable(): EnableableComponent {
        this.attr('disabled', '');
        this.enabled = false;

        return this;
    }
}

export = EnableableComponent;
