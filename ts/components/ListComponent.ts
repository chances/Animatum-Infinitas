import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class ListComponent<T> extends InputComponent<T> {
    protected _items: ListItem<T>[] = [];
    protected _itemWrapper: ListItemWrapper<T>;
    protected _selectedIndex: number = -1;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._itemWrapper = {
            add: (item: ListItem<T>) => {
                this._items.push(item);

                var element = $('<option value="' + (this._items.length - 1) + '">' + item.label + '</option>');
                this.e.append(element);
            },
            clear: () => {
                this._items = [];
                this._selectedIndex = -1;
                this.e.find('option').remove();
                //this.e.empty();
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
            this._selectedIndex = parseInt(this.e.val(), 10);
            this._events.trigger('selectionChanged', this.selectedItem, this);
        });
    }

    static get NullListItem() {
        return $('<option value="-1"></option>');
    }

    get items(): ListItemWrapper<T> {
        return this._itemWrapper;
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(index: number) {
        if (index < 0 || index >= this._items.length) {
            throw new RangeError("Index out of bounds");
        }

        this._selectedIndex = index;
        this.e.val(index.toString());
    }

    get selectedItem(): T {
        if (this._selectedIndex === -1) {
            return null;
        }

        return this._items[this._selectedIndex].value;
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
