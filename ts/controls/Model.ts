import TreeComponent = require('../components/TreeComponent');

import SceneNode = require('../scene/Node');
import SceneModel = require('../scene/Model');
import Bone = require('../scene/Bone');
import Mesh = require('../scene/Mesh');

class Model extends TreeComponent<Bone|Mesh> {
    private model: SceneModel;

    constructor (model: SceneModel = null) {
        super('#model');

        this.model = model;

        if (this.model !== null) {
            this.model.change((changedNode:SceneNode) => {
                if (changedNode === model) {
                    this.updateItems();
                }
            });
        }
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
                icon: '',
                value: mesh,
                parent: null
            });
        });
        bones.forEach((bone: Bone) => {
            this._itemWrapper.add({
                label: bone.name,
                icon: '',
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
