import THREE = require('three');
import randomColor = require('randomcolor');

import GeomObject = require('./../services/GeomObject');

import SceneNode = require('./Node');
import Bone = require('./Bone');

class Mesh extends SceneNode {
    name: string = '';

    private geometry: THREE.Geometry = null;
    private material: THREE.MeshPhongMaterial = null;
    private rawMesh: THREE.Mesh = null;
    private bounds: THREE.BoxHelper = null;
    private assignedBone: Bone = null;

    constructor(object: GeomObject) {
        super();

        this.material = new THREE.MeshPhongMaterial();
        this.material.color = new THREE.Color(randomColor());
        this.material.shininess = 5;
        this.material.transparent = true;
        this.material.opacity = 0.60;

        this.name = object.name;

        this.geometry = new THREE.Geometry();
        object.mesh.vertices.forEach((vertex: any) => {
            this.geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
        });
        // TODO: Assign texture coordinates
        /*
        //object.mesh.textureCoordinates.forEach((uv: TextureCoordinate) => {
        //
        //});
        */
        object.mesh.faces.forEach((face: Face, index: number) => {
            let geometryFace = new THREE.Face3(
                face.a, face.b, face.c,
                new THREE.Vector3(
                    face.normal.x,
                    face.normal.y,
                    face.normal.z
                )
            );
            geometryFace.vertexNormals.push(
                new THREE.Vector3(
                    object.mesh.vertices[face.a].normal.x,
                    object.mesh.vertices[face.a].normal.y,
                    object.mesh.vertices[face.a].normal.z
                ),
                new THREE.Vector3(
                    object.mesh.vertices[face.b].normal.x,
                    object.mesh.vertices[face.b].normal.y,
                    object.mesh.vertices[face.b].normal.z
                ),
                new THREE.Vector3(
                    object.mesh.vertices[face.c].normal.x,
                    object.mesh.vertices[face.c].normal.y,
                    object.mesh.vertices[face.c].normal.z
                )
            );
            this.geometry.faces.push(geometryFace);
        });

        this.rawMesh = new THREE.Mesh(this.geometry, this.material);
        this.bounds = new THREE.BoxHelper(this.rawMesh);

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

    get boundingBox(): THREE.BoxHelper {
        return this.bounds;
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
