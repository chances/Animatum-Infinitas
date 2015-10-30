class GeomObject {
    name: string;
    mesh: Mesh = null;

    constructor(name: string) {
        this.name = name;
    }
}

export = GeomObject;
