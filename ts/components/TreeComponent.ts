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
            add: (item: TreeItem<T>): void => {
                if (item.parent === null) {
                    this._items.push(item);
                } else {
                    let parentIndex = this._itemWrapper.indexOf(item.parent.value);
                    this._items.splice(parentIndex, 0, item);
                }

                let depth = this.getTreeItemDepth(item, 0);

                let element = document.createElement('span');
                element.classList.add('item');
                element.textContent = item.label;
                if (item.icon) {
                    let icon = document.createElement('i');
                    icon.classList.add('icon');
                    item.icon.split(' ').forEach((token: string) => icon.classList.add(token));
                    element.insertBefore(icon, element.firstChild);
                }
                element.addEventListener('mousedown', (event: MouseEvent) => {
                    let span = <HTMLSpanElement>(event.currentTarget);
                    this.itemSelected(this.indexOf(span));
                });
                this.element.appendChild(element);

                // Apply tree depth indentation
                if (depth > 0) {
                    let paddingLeft = parseInt(window.getComputedStyle(element).paddingLeft, 10);
                    element.style.paddingLeft = (paddingLeft + depth) + 'em';
                }
            },
            clear: (): void => {
                this._items = [];
                this._selectedIndex = -1;
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
            getItem: (index: number): TreeItem<T> => {
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

        this.element.addEventListener('keydown', (event: KeyboardEvent) => {
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

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(index: number) {
        if (index < 0 || index >= this._items.length) {
            throw new RangeError('Index out of bounds');
        }

        this._selectedIndex = index;
        let items = this.element.querySelectorAll('span.item');
        for (let i = 0; i < items.length; i += 1) {
            let item = <HTMLElement>items[i];
            item.classList.remove('selected');
        }
        let item = <HTMLElement>items[index];
        item.classList.add('selected');
    }

    get selectedItem(): T {
        if (this._selectedIndex === -1) {
            return null;
        }

        return this._itemWrapper.get(this._selectedIndex);
    }

    set selectedItem(item: T) {
        if (item !== null) {
            let index = this.items.indexOf(item);
            if (index !== -1) {
                this.itemSelected(index);
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

    private itemSelected(index: number): void {
        if (index !== this._selectedIndex) {
            this.selectedIndex = index;
            this.events.trigger('selectionChanged', this.selectedItem, this);
        }
    }
}

export = TreeComponent;
