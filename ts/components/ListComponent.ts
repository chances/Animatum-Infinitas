import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class ListComponent<T> extends InputComponent<T> {
    protected _items: ListItem<T>[] = [];
    protected itemWrapper: ListItemWrapper<T>;

    constructor (elementSelector: string);
    constructor (element: HTMLSelectElement);
    constructor (element: any) {
        super(element);

        this.itemWrapper = {
            add: (item: ListItem<T>): void => {
                this._items.push(item);

                let select = <HTMLSelectElement>this.element,
                    element = document.createElement('option');
                element.value = (this._items.length - 1).toString();
                element.text = item.label;
                select.add(element);
            },
            clear: (): void => {
                this._items = [];
                //<HTMLSelectElement>(this.element).selectedIndex = -1;
                while (this.element.firstChild) {
                    this.element.removeChild(this.element.firstChild);
                }
            },
            get: (index: number): T => {
                if (index < 0 || index >= this._items.length) {
                    throw new RangeError('Index out of bounds');
                }
                return this._items[index].value;
            },
            getItem: (index: number): ListItem<T> => {
                if (index < 0 || index >= this._items.length) {
                    throw new RangeError('Index out of bounds');
                }
                return this._items[index];
            },
            indexOf: (item: T): number => {
                let index = -1;
                for (let i = 0; i < this._items.length; i += 1) {
                    if (this._items[i].value === item) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        };

        super.change(() => {
            //let select = <HTMLSelectElement>this.element;
            //select.selectedIndex = parseInt(select.value, 10);
            this.events.trigger('selectionChanged', this.selectedItem, this);
        });
    }

    static get NullListItem(): ListItem<any> {
        return {
            label: '',
            value: null
        };
    }

    get items(): ListItemWrapper<T> {
        return this.itemWrapper;
    }

    get selectedIndex(): number {
        let select = <HTMLSelectElement>this.element;
        return select.selectedIndex;
    }

    set selectedIndex(index: number) {
        if (index < 0 || index >= this._items.length) {
            throw new RangeError('Index out of bounds');
        }

        let select = <HTMLSelectElement>this.element;
        select.selectedIndex = index;
    }

    get selectedItem(): T {
        let select = <HTMLSelectElement>this.element,
            selectedIndex = select.selectedIndex;
        if (selectedIndex === -1) {
            return null;
        }

        return this._items[selectedIndex].value;
    }

    set selectedItem(item: T) {
        if (item !== null) {
            let index = this.items.indexOf(item);
            if (index !== -1) {
                this.selectedIndex = index;
            }
        }
    }

    change(callback: Events.BridgeCallback<T>): ListComponent<T> {
        this.addEventListener('selectionChanged', (item: T) => {
            callback.call(this, item);
        });

        return this;
    }
}

export = ListComponent;
