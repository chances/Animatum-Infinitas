import Events = require('../Bridge');

import InputComponent = require('./InputComponent');

class TreeComponent<T> extends InputComponent<T> {
    protected _items: TreeItem<T>[] = [];
    protected _itemWrapper: TreeItemWrapper<T>;
    protected _selectedIndex: number = -1;

    constructor (elementSelector: string);
    constructor (element: HTMLElement);
    constructor (element: any) {
        super(element);

        this._itemWrapper = {
            add: (item: TreeItem<T>) => {
                if (item.parent === null) {
                    this._items.push(item);
                } else {
                    let parentIndex = this._itemWrapper.indexOf(item.parent.value);
                    this._items.splice(parentIndex, 0, item);
                }

                let depth = this.getTreeItemDepth(item, 0);

                let element = $('<span>');
                element.addClass('item');
                element.text(item.label);
                if (item.icon) {
                    element.prepend(
                        $('<i>').addClass('icon').addClass(item.icon)
                    );
                }
                element.mousedown((event) => {
                    let span = <HTMLSpanElement>(event.currentTarget);
                    let index = this.e.find('span.item').index(span);
                    this.itemSelected(index);
                });
                this.e.append(element);

                // Apply tree depth indentation
                if (depth > 0) {
                    let paddingLeft = parseInt(element.css('padding-left'));
                    element.css('padding-left', (paddingLeft + depth) + 'em');
                }
            },
            clear: () => {
                this._items = [];
                this._selectedIndex = -1;
                this.e.empty();
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

        this.e.keydown((event: KeyboardEvent) => {
            let selectedIndex: number = this.selectedIndex;
            if (event.keyCode === 38) {
                if (selectedIndex !== -1) {
                    selectedIndex--;
                }
            } else if (event.keyCode === 40) {
                selectedIndex++;
            } else {
                return;
            }
            if (selectedIndex < 0) {
                selectedIndex = 0;
            } else if (selectedIndex > this._items.length - 1) {
                selectedIndex--;
            }
            this.itemSelected(selectedIndex);
        });
    }

    get items(): TreeItemWrapper<T> {
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
        this.e.find('span.item').removeClass('selected').get(index).classList.add('selected');
    }

    get selectedItem(): T {
        if (this._selectedIndex === -1) {
            return null;
        }

        return this._itemWrapper.get(this._selectedIndex);
    }

    set selectedItem(item: T) {
        if (item !== null) {
            var index = this.items.indexOf(item);
            if (index !== -1) {
                this.selectedIndex = index;
            }
        }
    }

    change(callback: Events.BridgeCallback<T>): TreeComponent<T> {
        this.addEventListener('selectionChanged', (item: T) => {
            callback.call(this, item);
        });

        return this;
    }

    private getTreeItemDepth(item: TreeItem<T>, depth: number): number {
        let itemDepth = depth;
        if (item.parent !== null) {
            itemDepth += this.getTreeItemDepth(item.parent, itemDepth + 1);
        }
        return itemDepth;
    }

    private itemSelected(index: number) {
        if (index !== this._selectedIndex) {
            this.selectedIndex = index;
            this._events.trigger('selectionChanged', this.selectedItem, this);
        }
    }
}

export = TreeComponent;
