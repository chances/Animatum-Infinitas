import THREE = require('three');
import OrbitControls = require('three-orbit-controls');

import Component = require('../components/Component');

import SceneNode = require('../scene/Node');
import Model = require('../scene/Model');
import Grid = require('../scene/primitives/Grid');
import Axies = require('../scene/primitives/Axies');

class WebGLView extends Component {
    private renderer: THREE.WebGLRenderer = null;
    private scene: THREE.Scene = null;
    private camera: THREE.PerspectiveCamera = null;
    private controls: OrbitControls = null;

    private timeline: Component = null;

    private model: Model = null;

    private timestamp: number;

    constructor (model: Model) {
        super('#glView');

        this.timeline = new Component('#timeline');

        this.model = model;
        this.model.childAdded((node: SceneNode) => {
            this.scene.add(node.mesh);
        });
        this.model.childRemoved((node: SceneNode) => {
            this.scene.remove(node.mesh);
        });
        this.ready();

        window.addEventListener('resize', () => {
            let width = this.width,
                height = this.e.parent().height() - this.timeline.height;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, true);
        });
    }

    private ready(): void {
        let width = this.width,
            height = this.e.height();

        this.camera = new THREE.PerspectiveCamera( 75, width / height, 1, 100000 );
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(5, 5, 6);
        //this.camera.position.z = 75;
        this.camera.lookAt(new THREE.Vector3());
        this.camera.updateProjectionMatrix();

        let orbitControls = OrbitControls(THREE);
        this.controls = new orbitControls(this.camera, this.e.get(0));

        this.scene = new THREE.Scene();

        // Lights
        let ambient = new THREE.AmbientLight( 0xffffff );
        this.scene.add( ambient );

        let directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( -9, -9, 11 ).normalize();
        directionalLight.color = new THREE.Color('rgb(100,100,100)');
        this.scene.add( directionalLight );

        directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 9, -9, 11 ).normalize();
        directionalLight.color = new THREE.Color('rgb(100,100,100)');
        this.scene.add( directionalLight );

        directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set(0, 15, 15 ).normalize();
        directionalLight.color = new THREE.Color('rgb(100,100,100)');
        this.scene.add( directionalLight );

        let grid = new Grid();
        this.scene.add(grid.group);

        let axies = new Axies();
        this.scene.add(axies.mesh);

        this.renderer = new THREE.WebGLRenderer({
            devicePixelRatio: window.devicePixelRatio,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = 'relative';
        this.e.append(this.renderer.domElement);

        window.requestAnimationFrame((time: number) => { this.animate(time); });
    }

    private animate(time: number): void {
        if (!this.timestamp) {
            this.timestamp = time;
        }
        let progress = this.timestamp - time;
        this.render(progress);

        window.requestAnimationFrame((time: number) => { this.animate(time); });
    }

    private render(progress?: number): void {
        this.renderer.render(this.scene, this.camera);
    }
}

export = WebGLView;
