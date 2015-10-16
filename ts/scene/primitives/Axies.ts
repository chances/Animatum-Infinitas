import THREE = require('three');

class Axies {
    private rawSize = 22;
    private rawLineWidth = 1.25;
    private geometry = new THREE.Geometry();
    private material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    private rawMesh: THREE.LineSegments;

    constructor() {
        this.material.linewidth = this.rawLineWidth;

        this.updateAxies();
    }

    get lineWidth() {
        return this.rawLineWidth;
    }

    set lineWidth(value: number) {
        this.rawLineWidth = value;

        this.updateAxies();
    }

    get size() {
        return this.rawSize;
    }

    set size(value: number) {
        this.rawSize = value;

        this.updateAxies();
    }

    get visible() {
        return this.rawMesh.visible;
    }

    set visible(value: boolean) {
        this.rawMesh.visible = value;
    }

    get mesh() {
        return this.rawMesh;
    }

    private updateAxies() {
        let red = new THREE.Color(1, 0, 0),
            green = new THREE.Color(0, 1, 0),
            blue = new THREE.Color(0, 0, 1);

        for (let i = (this.rawSize * -1); i < this.rawSize; i+=0.4) {
            let add = 0.2;
            if (i > 0) add = 0.4;
            if (i < 0 && i > -0.2) add = 0.4;

            this.geometry.vertices.push(
                new THREE.Vector3(i, 0, 0),
                new THREE.Vector3(i + add, 0, 0),
                new THREE.Vector3(0, i, 0),
                new THREE.Vector3(0, i + add, 0),
                new THREE.Vector3(0, 0, i),
                new THREE.Vector3(0, 0, i + add)
            );

            this.geometry.colors.push(
                red, red,
                green, green,
                blue, blue
            );
        }

        this.rawMesh = new THREE.LineSegments(this.geometry, this.material);
    }
}

export = Axies;
