interface Marshaller<T> {
    (value: any): T;
}

interface ListItem<T> {
    label: string;
    value: T;
}

interface ListItemWrapper<T> {
    add(item: ListItem<T>): void;
    clear(): void;
    get(index: number): T;
    getItem(index: number): ListItem<T>;
    indexOf(item: T): number;
}

interface ZeptoCollection {
    hasAttr(name: string): boolean;
}
