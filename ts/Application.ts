
class Application {
    private _debugMode: boolean;

    constructor() {
        $(() => {
            this._debugMode = false;
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
