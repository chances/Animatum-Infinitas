import THREE = require('three');

class Sphere {
    private rawMesh: THREE.Mesh;
    private material: THREE.MeshBasicMaterial;

    constructor(position: THREE.Vector3, radius: number, subdivisions: number, color: THREE.Color) {
        this.material = new THREE.MeshBasicMaterial();
        this.material.color = color;
        this.rawMesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, subdivisions, subdivisions),
            this.material
        );
        this.rawMesh.position = position;
    }

    get color() {
        return this.material.color;
    }

    set color(value: THREE.Color) {
        this.material.color = value;
    }

    get mesh() {
        return this.rawMesh;
    }
}

export = Sphere;
