import THREE = require('three');

import SceneNode = require('./Node');
import Bone = require('./Bone');

class Mesh extends SceneNode {
    name: string = '';

    private geometry: THREE.Geometry = null;
    private material: THREE.MeshPhongMaterial = null;
    private rawMesh: THREE.Mesh = null;
    private assignedBone: Bone = null;

    constructor(object: any) {
        super();

        this.material = new THREE.MeshPhongMaterial();
        this.material.color = new THREE.Color('green');
        this.material.shininess = 5;
        this.material.transparent = true;
        this.material.opacity = 0.60;

        this.name = object.name;

        this.geometry = new THREE.Geometry();
        object.mesh.verticies.forEach((vertex: any) => {
            this.geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
        });
        //object.mesh.textureCoordinates.forEach((uv: any) => {
        //
        //});
        object.mesh.faces.forEach((face: any, index: number) => {
            let geometryFace = new THREE.Face3(
                <number>face.vertex[0],
                <number>face.vertex[1],
                <number>face.vertex[2]
            );
            geometryFace.vertexNormals.push(
                new THREE.Vector3(
                    object.mesh.vertexNormals[index * 3].x,
                    object.mesh.vertexNormals[index * 3].y,
                    object.mesh.vertexNormals[index * 3].z
                ),
                new THREE.Vector3(
                    object.mesh.vertexNormals[index * 3 + 1].x,
                    object.mesh.vertexNormals[index * 3 + 1].y,
                    object.mesh.vertexNormals[index * 3 + 1].z
                ),
                new THREE.Vector3(
                    object.mesh.vertexNormals[index * 3 + 2].x,
                    object.mesh.vertexNormals[index * 3 + 2].y,
                    object.mesh.vertexNormals[index * 3 + 2].z
                )
            );
            this.geometry.faces.push(geometryFace);
        });

        this.rawMesh = new THREE.Mesh(this.geometry, this.material);

        this.bone = null;
    }

    get color(): THREE.Color {
        return this.material.color;
    }

    set color(value: THREE.Color) {
        this.material.color = value;

        this.events.trigger('nodeChanged', this, this);
    }

    get mesh(): THREE.Mesh {
        return this.rawMesh;
    }

    get polygonCount(): number {
        return this.geometry.faces.length;
    }

    get bone(): Bone {
        return this.assignedBone;
    }

    set bone(value: Bone) {
        this.assignedBone = value;
        if (value !== null && this.rawMesh) {
            this.rawMesh.position = this.assignedBone.translation;
        } else {
            this.rawMesh.position.x = 0;
            this.rawMesh.position.y = 0;
            this.rawMesh.position.z = 0;
        }

        this.events.trigger('nodeChanged', this, this);
    }

    toString(): string {
        return this.name;
    }
}

export = Mesh;
