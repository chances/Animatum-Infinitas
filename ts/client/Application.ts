import ModelView = require('../controls/Model');
import WebGLView = require('../controls/WebGLView');

import ASEModel = require('./../services/ASEModel');
import GeomObject = require('./../services/GeomObject');
import Model = require('../scene/Model');
import Bone = require('../scene/Bone');
import Mesh = require('../scene/Mesh');

class Application {
    private model: Model = new Model();
    private modelView: ModelView = null;
    private glView: WebGLView = null;
    private _debugMode: boolean = false;

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.glView = new WebGLView(this.model);
            this.modelView = new ModelView(this.model, this.glView);

            document.querySelector('#openASE').addEventListener('click', () => {
                ipc.send('open-ase');
            });

            ipc.on('open-ase', (event: string) => {
                this.model.clear();
                let model: ASEModel = JSON.parse(event);
                model.geomObjects.forEach((geomObject: GeomObject) => {
                    if (geomObject.mesh.vertices.length === 1) {
                        this.model.add(new Bone(geomObject));
                    } else {
                        this.model.add(new Mesh(geomObject));
                    }
                });
            })
        });
    }

    get debugMode(): boolean {
        return this._debugMode;
    }

    set debugMode(debugMode: boolean) {
        this._debugMode = debugMode;
    }

    debug(): void {
        this._debugMode = true;
    }
}

export = Application;
