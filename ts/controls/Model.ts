import THREE = require('three');

import Helpers = require('../Helpers');

import TreeComponent = require('../components/TreeComponent');

import WebGLView = require('./WebGLView');

import SceneNode = require('../scene/Node');
import SceneModel = require('../scene/Model');
import Bone = require('../scene/Bone');
import Mesh = require('../scene/Mesh');

class Model extends TreeComponent<Bone|Mesh> {
    private model: SceneModel;
    private scene: THREE.Scene;
    private lastBoundingBox: THREE.Object3D = null;

    constructor (model: SceneModel, glView: WebGLView) {
        super('#model');

        this.model = model;
        this.scene = glView.rawScene;

        this.change((selectedItem: Bone|Mesh) => {
            if (this.lastBoundingBox !== null) {
                this.scene.remove(this.lastBoundingBox);
            }
            this.scene.add(selectedItem.boundingBox);
            this.lastBoundingBox = selectedItem.boundingBox;
        });

        this.model.change((changedNode:SceneNode) => {
            if (changedNode === model) {
                this.updateItems();
            }
        });

        glView.on('objectClicked', (object: Mesh|Bone) => {
            this.selectedItem = object;
        })
    }

    private updateItems() {
        let selectedItem = this.selectedItem,
            meshes = this.model.meshes.sort(function (a: Mesh, b: Mesh) {
                return a.name.localeCompare(b.name);
            }),
            bones = this.model.bones.sort(function (a: Bone, b: Bone) {
                return a.name.localeCompare(b.name);
            });
        this._itemWrapper.clear();
        meshes.forEach((mesh: Mesh) => {
            this._itemWrapper.add({
                label: mesh.name,
                icon: 'fa fa-square-o',
                value: mesh,
                parent: null
            });
        });
        bones.forEach((bone: Bone) => {
            this._itemWrapper.add({
                label: bone.name,
                icon: 'fa fa-circle-thin',
                value: bone,
                parent: null
            });
        });
        // Select the previously selected item, if any
        if (selectedItem !== null) {
            let selectedIndex = this._itemWrapper.indexOf(selectedItem);
            if (selectedIndex > -1) {
                this.selectedIndex = selectedIndex;
            }
        }
    }
}

export = Model;
