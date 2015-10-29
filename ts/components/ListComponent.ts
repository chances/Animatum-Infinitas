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
            add: (item: ListItem<T>) => {
                this._items.push(item);

                let element = document.createElement('option');
                element.value = this._items.length - 1;
                element.text = item.label;
                <HTMLSelectElement>(this.element).add(element);
            },
            clear: () => {
                this._items = [];
                //<HTMLSelectElement>(this.element).selectedIndex = -1;
                while (this.element.firstChild) {
                    this.element.removeChild(this.element.firstChild);
                }
            },
            get: (index: number) => {
                if (index < 0 || index >= this._items.length) {
                    throw new RangeError("Index out of bounds");
                }
                return this._items[index].value;
            },
            getItem: (index: number) => {
                if (index < 0 || index >= this._items.length) {
                    throw new RangeError("Index out of bounds");
                }
                return this._items[index];
            },
            indexOf: (item: T) => {
                var index = -1;
                for (var i = 0; i < this._items.length; i++) {
                    if (this._items[i].value === item) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        };

        this.e.change(() => {
            <HTMLSelectElement>(this.element).selectedIndex = parseInt(<HTMLSelectElement>(this.element).value, 10);
            this.events.trigger('selectionChanged', this.selectedItem, this);
        });
    }

    static get NullListItem() {
        let nullListItem: HTMLOptionElement = document.createElement('option');
        nullListItem.value = '-1';
        return nullListItem;
    }

    get items(): ListItemWrapper<T> {
        return this.itemWrapper;
    }

    get selectedIndex() {
        return <HTMLSelectElement>(this.element).selectedIndex;
    }

    set selectedIndex(index: number) {
        if (index < 0 || index >= this._items.length) {
            throw new RangeError("Index out of bounds");
        }

        <HTMLSelectElement>(this.element).selectedIndex = index;
        <HTMLInputElement>(this.element).value = index.toString();
    }

    get selectedItem(): T {
        let selectedIndex = <HTMLSelectElement>(this.element).selectedIndex;
        if (selectedIndex === -1) {
            return null;
        }

        return this._items[selectedIndex].value;
    }

    set selectedItem(item: T) {
        if (item !== null) {
            var index = this.items.indexOf(item);
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
