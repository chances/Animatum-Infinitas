import Component = require('../components/Component');

class WebGLView extends Component {
    private renderer: THREE.WebGLRenderer = null;
    private scene: THREE.Scene = null;
    private camera: THREE.Camera = null;

    constructor () {
        super('glView');

        $(() => {
            this.ready();
        });
    }

    private ready() {
        let width = this.e.width(),
            height = this.e.height();

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
        this.e.append(this.renderer.domElement);
    }

    private animate() {
        window.requestAnimationFrame(this.animate);
        this.render();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export = WebGLView;
