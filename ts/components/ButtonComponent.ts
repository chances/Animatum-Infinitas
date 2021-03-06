import EnableableComponent = require('./EnableableComponent');

class ButtonComponent extends EnableableComponent {

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);
    }

    click(callback: () => void): void {
        this.e.addEventListener('click', function (): void {
            callback();
        });
    }
}

export = ButtonComponent;
