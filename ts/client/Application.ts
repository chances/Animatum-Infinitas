import THREE = require('three');

import ModelView = require('../controls/Model');
import WebGLView = require('../controls/WebGLView');

import Model = require('../scene/Model');

class Application {
    private model = new Model();
    private modelView: ModelView = null;
    private glView: WebGLView = null;
    private _debugMode: boolean = false;

    constructor() {
        $(() => {
            this.modelView = new ModelView(this.model);
            this.glView = new WebGLView(this.model);
        });
    }

    get debugMode() {
        return this._debugMode;
    }

    set debugMode(debugMode: boolean) {
        this._debugMode = debugMode;
    }

    debug() {
        this._debugMode = true;
    }
}

export = Application;
