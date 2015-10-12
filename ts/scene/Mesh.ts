import THREE = require('three');

import Node = require('./Node');
import Bone = require('./Bone');

class Mesh extends Node {
    name: string = '';

    private geometry: THREE.Geometry = null;
    private material: THREE.MeshBasicMaterial = null;
    private mesh: THREE.Mesh = null;
    private assignedBone: Bone = null;

    constructor(object?: any) {
        super();

        this.material = new THREE.MeshBasicMaterial();
        this.material.color = new THREE.Color('green');

        if (object) {
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

            this.mesh = new THREE.Mesh(this.geometry, this.material);

            this.bone = null;
        }
    }

    get color(): THREE.Color {
        return this.material.color;
    }

    set color(value: THREE.Color) {
        this.material.color = value;
    }

    get polygonCount() {
        if (this.geometry) {
            return this.geometry.faces.length;
        }
        return 0;
    }

    get bone() {
        return this.assignedBone;
    }

    set bone(value: Bone) {
        this.assignedBone = value;
        if (value !== null && this.mesh) {
            this.mesh.position = this.assignedBone.translation;
        } else {
            this.mesh.position.x = 0;
            this.mesh.position.y = 0;
            this.mesh.position.z = 0;
        }
    }

    toString() {
        return this.name;
    }
}

export = Mesh;
