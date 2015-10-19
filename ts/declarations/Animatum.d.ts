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

interface TreeItem<T> {
    label: string;
    icon: string;
    value: T;
    parent: TreeItem<T>;
}

interface TreeItemWrapper<T> {
    add(item: TreeItem<T>): void;
    clear(): void;
    get(index: number): T;
    getItem(index: number): TreeItem<T>;
    indexOf(item: T): number;
}

interface ZeptoCollection {
    hasAttr(name: string): boolean;
}

interface TextureCoordinate {
    u: number;
    v: number;
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface Vertex extends Vector3 {
    normal?: Vector3;
    textureCoordinates?: TextureCoordinate;
}

interface Face {
    a: number;
    b: number;
    c: number;
    normal?: Vector3
}

interface Mesh {
    vertices: Vertex[];
    faces: Face[];
}
