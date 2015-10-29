import Events = require('../Bridge');

class Component {
    protected element: HTMLElement;
    protected events: Events.Bridge;

    private cachedParent: Component = null;
    private oldDisplayState: string = null;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        if (typeof element === 'string') {
            this.element = <HTMLElement>document.querySelector(element);
        } else {
            this.element = <HTMLElement>element;
        }
        this.events = new Events.Bridge();

        this.element.addEventListener('keyup', (data: KeyboardEvent) => {
            this.events.trigger('keyup', data);
        });
    }

    get e(): HTMLElement {
        return this.element;
    }

    get parent(): Component {
        if (this.cachedParent === null ||
            !this.cachedParent.e.isEqualNode(this.element.parentNode)) {
            if (this.element.parentNode === null) {
                this.cachedParent = null;
            } else {
                this.cachedParent = new Component(<HTMLElement>this.element.parentNode);
            }
        }
        return this.cachedParent;
    }

    get id(): string {
        return this.element.id;
    }

    get width(): number {
        return this.element.getBoundingClientRect().width;
    }

    get height(): number {
        return this.element.getBoundingClientRect().height;
    }

    addEventListener(event: string, callback: Events.BridgeCallback<any>): number {
        return this.events.on(event, callback);
    }

    on(event: string, callback: Events.BridgeCallback<any>): Component {
        this.events.on(event, callback);

        return this;
    }

    removeEventListener(id: number): void;
    removeEventListener(callback: Events.BridgeCallback<any>): void;
    removeEventListener(idOrCallback: any): void {
        this.events.off(idOrCallback);
    }

    off(id: number): Component;
    off(callback: Events.BridgeCallback<any>): Component;
    off(idOrCallback: any): Component {
        this.events.off(idOrCallback);

        return this;
    }

    attr(name: string): string;
    attr(name: string, value: string): Component;
    attr(name: string, value?: string): any {
        if (value === undefined) {
            return this.element.getAttribute(name);
        } else {
            this.element.setAttribute(name, value);
        }

        return this;
    }

    data(name: string): string;
    data(name: string, value: string): Component;
    data(name: string, value?: string): any {
        if (value === undefined) {
            return this.element.dataset[name];
        } else {
            this.element.dataset[name] = value;
        }

        return this;
    }

    show() {
        if (window.getComputedStyle(this.element).display === 'none') {
            if (this.oldDisplayState === null) {
                this.element.style.display = 'block';
            } else {
                this.element.style.display = this.oldDisplayState;
            }
        }
    }

    hide() {
        let computedStyle = window.getComputedStyle(this.element);
        if (computedStyle.display !== 'none') {
            this.oldDisplayState = computedStyle.display;
            this.element.style.display = 'none';
        }
    }

    indexOf(elementSelector: string): number;
    indexOf(element: HTMLElement): number;
    indexOf(element: any): number {
        let el: HTMLElement = element;
        if (typeof element === 'string') {
            el = <HTMLElement>this.element.querySelector(element);
        }
        for (let i = 0; i < this.element.children.length; ++i) {
            if (this.element.children[i].isEqualNode(el)) {
                return i;
            }
        }
        return -1;
    }

    keyup(callback: Events.BridgeCallback<KeyboardEvent>): Component {
        this.on('keyup', callback);

        return this;
    }
}

export = Component;
