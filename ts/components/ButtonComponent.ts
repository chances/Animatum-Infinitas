import EnableableComponent = require('./EnableableComponent');

class ButtonComponent extends EnableableComponent {

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);
    }

    click(callback: () => void) {
        this.e.addEventListener('click', function () {
            callback();
        });
    }
}

export = ButtonComponent;
