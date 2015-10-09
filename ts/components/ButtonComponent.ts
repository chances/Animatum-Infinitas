import EnableableComponent = require('./EnableableComponent');

class ButtonComponent extends EnableableComponent {

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this.e.change(() => {
            this._events.trigger('change', this.e.val());
        });
    }

    click(callback: () => void) {
        this.e.click(function () {
            callback();
        });
    }
}

export = ButtonComponent;
