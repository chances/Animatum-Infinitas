import app = require('app');
import CrashReporter = require('crash-reporter');
import BrowserWindow = require('browser-window');

class Application {
    private mainWindow: GitHubElectron.BrowserWindow = null;
    private _debugMode: boolean;

    constructor() {
        //$(() => {
        //    this._debugMode = false;
        //});

        this._debugMode = false;

        CrashReporter.start();

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('ready', this.ready);
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

    private ready(): void {
        this.mainWindow = new BrowserWindow({
            icon: __dirname + '/../images/Animatum.ico',
            width: 800,
            height: 600,
            'min-width': 800,
            'min-height': 600,
            center: true,
            'standard-window': false,
        });

        console.log(__dirname + '/../images/Animatum.ico');

        this.mainWindow.loadUrl('file://' + __dirname + '/../index.html');
        this.mainWindow.openDevTools();

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }
}

export = Application;
