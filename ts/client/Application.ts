import THREE = require('three');

class Application {
    private renderer: THREE.WebGLRenderer = null;
    private scene: THREE.Scene = null;
    private camera: THREE.Camera = null;
    private _debugMode: boolean = false;

    constructor() {
        $(() => {
            this.ready();
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

    private ready() {
        let glView = $('glView'),
            width = glView.width(),
            height = glView.height();

        this.camera = new THREE.PerspectiveCamera( 75, width / height, 1, 100000 );
        this.camera.position.z = 75;

        this.scene = new THREE.Scene();

        // lights
        var ambient = new THREE.AmbientLight( 0xffffff );
        this.scene.add( ambient );

        // more lights
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, -70, 100 ).normalize();
        this.scene.add( directionalLight );

        // renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = "relative";
        glView.append(this.renderer.domElement);
    }

    private animate() {
        window.requestAnimationFrame(this.animate);
        this.render();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export = Application;
