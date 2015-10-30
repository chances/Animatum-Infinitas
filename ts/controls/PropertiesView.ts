import THREE = require('three');
import randomColor = require('randomcolor');

import Helpers = require('../Helpers');

import Component = require('../components/Component');
import ButtonComponent = require('../components/ButtonComponent');
import ListComponent = require('../components/ListComponent');

import SceneNode = require('../scene/Node');
import SceneModel = require('../scene/Model');
import Bone = require('../scene/Bone');
import Mesh = require('../scene/Mesh');

import ModelView = require('./Model');

class Properties extends Component {
    private colorButton: ButtonComponent;
    private parentSelect: ListComponent<Bone>;

    private scene: SceneModel;
    private model: ModelView;
    private targetNode: Bone|Mesh = null;

    private table: HTMLTableElement = null;

    constructor (scene: SceneModel, model: ModelView) {
        super('#properties');

        this.scene = scene;
        this.model = model;

        this.scene.change((changedNode: SceneNode) => {
            if (changedNode === this.scene) {
                if (this.scene.children.length === 0) {
                    this.targetNode = null;
                }
                this.updateProperties();
            }
        });

        this.model.change((selectedNode: Bone|Mesh) => {
            this.targetNode = selectedNode;
            this.updateParentSelect();
            this.updateProperties();
        });

        this.element.classList.add('hidden');

        this.table = document.createElement('table');
        this.element.appendChild(this.table);

        this.colorButton = new ButtonComponent(document.createElement('button'));
        this.colorButton.e.classList.add('colored');
        this.colorButton.text('Randomize color');
        this.colorButton.click((): void => {
            let color = new THREE.Color((randomColor())),
                colorHex = color.getHexString(),
                contrast: string =
                    ((Helpers.getContrastYIQ(colorHex) === 'black') ? 'low' : 'high') + '-contrast';
            this.targetNode.color = color;
            this.colorButton.e.classList.remove('high-contrast');
            this.colorButton.e.classList.remove('low-contrast');
            this.colorButton.e.classList.add(contrast);
            this.colorButton.e.style.backgroundColor = '#' + colorHex;
        });

        this.parentSelect = new ListComponent<Bone>(document.createElement('select'));
        this.parentSelect.change((selectedBone: Bone): void => {
            if (this.targetNode !== null && Helpers.objectIsA(this.targetNode, Bone)) {
                let target: Bone = <Bone>this.targetNode;
                if (selectedBone) {
                    target.parent = selectedBone;
                } else {
                    target.parent = this.scene;
                }
            }
        });
        this.updateParentSelect();
    }

    private updateParentSelect(): void {
        let targetNodeParent: Bone = this.targetNode === null ? null : <Bone>this.targetNode.parent,
            bones: Bone[] = this.scene.bones;
        this.parentSelect.items.clear();
        this.parentSelect.items.add(ListComponent.NullListItem);
        for (let i = 0; i < bones.length; i += 1) {
            this.parentSelect.items.add({
                label: bones[i].name,
                value: bones[i]
            });
        }
        if (targetNodeParent !== null && <SceneNode>targetNodeParent !== this.scene) {
            this.parentSelect.selectedItem = targetNodeParent;
        } else {
            this.parentSelect.selectedIndex = 0;
        }
    }

    private updateProperties(): void {
        if (this.targetNode === null) {
            this.element.classList.add('hidden');
        } else {
            this.element.classList.remove('hidden');

            while (this.table.firstChild) {
                this.table.removeChild(this.table.firstChild);
            }

            this.addRow('Name:', document.createTextNode(this.targetNode.name));
            let position = this.targetNode.mesh.position;
            this.addRow('Position:', document.createTextNode(
                '(' + this.formatNumber(position.x) + ', ' +
                this.formatNumber(position.y) + ', ' +
                this.formatNumber(position.z) + ')'
            ));

            let bgColor: string = this.targetNode.color.getHexString(),
                contrast: string = ((Helpers.getContrastYIQ(bgColor) === 'black') ? 'low' : 'high') + '-contrast';
            this.colorButton.e.classList.add(contrast);
            this.colorButton.e.style.backgroundColor = '#' + bgColor;
            this.addRow('Color:', this.colorButton.e);

            if (Helpers.objectIsA(this.targetNode, Bone)) {
                this.addRow('Parent:', this.parentSelect.e);
            }
        }
    }

    private addRow(label: string, value: Node): HTMLTableRowElement {
        let row: HTMLTableRowElement = document.createElement('tr'),
            labelCell: HTMLTableCellElement = document.createElement('td'),
            valueCell: HTMLTableCellElement = document.createElement('td');

        labelCell.textContent = label;
        valueCell.appendChild(value);

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        this.table.appendChild(row);

        return row;
    }

    private formatNumber(number: number) {
        if (!Number.isInteger(number)) {
            return number.toFixed(3).toString();
        }
        return number.toFixed(0).toString();
    }
}

export = Properties;
