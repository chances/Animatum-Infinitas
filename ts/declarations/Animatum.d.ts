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

declare module 'randomcolor' {
    function randomColor(): string;
    export = randomColor;
}

declare interface IpcEvent {
    returnValue: any;
    sender: GitHubElectron.WebContents;
    send(channel: string, ...args: any[]): void;
}

declare interface IpcResponse {

}

declare class IPC {
    on(channel: string, callback: (event: IpcEvent) => void): void;
    on(channel: string, callback: (event: any) => void): void;
    send(channel: string, ...args: any[]): void;
    sendSync(channel: string, ...args: any[]): IpcResponse;
}

declare module 'ipc' {
    var ipc: IPC;
    export = ipc;
}

declare var ipc: IPC;
