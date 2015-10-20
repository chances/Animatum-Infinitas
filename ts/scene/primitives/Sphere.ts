import THREE = require('three');

class Sphere {
    private rawMesh: THREE.Mesh;
    private material: THREE.MeshPhongMaterial;

    constructor(position: THREE.Vector3, radius: number, subdivisions: number, color: THREE.Color) {
        this.material = new THREE.MeshPhongMaterial();
        this.material.color = color;
        this.material.shininess = 5;
        this.rawMesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, subdivisions, subdivisions),
            this.material
        );
        this.rawMesh.position.set(position.x, position.y, position.z);
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
