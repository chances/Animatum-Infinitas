import THREE = require('three');
import OrbitControls = require('three-orbit-controls');

import Component = require('../components/Component');

import Grid = require('../scene/primitives/Grid');

class WebGLView extends Component {
    private renderer: THREE.WebGLRenderer = null;
    private scene: THREE.Scene = null;
    private camera: THREE.PerspectiveCamera = null;
    private controls: OrbitControls = null;

    private timestamp: number;

    constructor () {
        super('#glView');

        this.ready();

        this.optimizedResize.add(() => {
            let width = this.e.width(),
                height = this.e.height();

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, true);
        });
    }

    private optimizedResize = (function() {
        var callbacks = [],
            running = false;

        // fired on resize event
        function resize() {

            if (!running) {
                running = true;

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(runCallbacks);
                } else {
                    setTimeout(runCallbacks, 66);
                }
            }

        }

        // run the actual callbacks
        function runCallbacks() {

            callbacks.forEach(function(callback) {
                callback();
            });

            running = false;
        }

        // adds callback to loop
        function addCallback(callback) {

            if (callback) {
                callbacks.push(callback);
            }

        }

        return {
            // public method to add additional callback
            add: function(callback) {
                if (!callbacks.length) {
                    window.addEventListener('resize', resize);
                }
                addCallback(callback);
            }
        }
    }());

    private ready() {
        let width = this.e.width(),
            height = this.e.height();

        this.camera = new THREE.PerspectiveCamera( 75, width / height, 1, 100000 );
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(10, 10, 10);
        //this.camera.position.z = 75;
        this.camera.lookAt(new THREE.Vector3());
        this.camera.updateProjectionMatrix();

        this.controls = new (OrbitControls(THREE))(this.camera);

        this.scene = new THREE.Scene();

        // lights
        var ambient = new THREE.AmbientLight( 0xffffff );
        this.scene.add( ambient );

        // more lights
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, -700, 500 ).normalize();
        this.scene.add( directionalLight );

        let grid = new Grid();
        this.scene.add(grid.group);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            devicePixelRatio: window.devicePixelRatio,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = "relative";
        this.e.append(this.renderer.domElement);

        window.requestAnimationFrame((time) => { this.animate(time); });
    }

    private animate(time: number) {
        if (!this.timestamp) {
            this.timestamp = time;
        }
        let progress = this.timestamp - time;
        this.render(progress);

        window.requestAnimationFrame((time) => { this.animate(time); });
    }

    private render(progress?: number) {
        this.renderer.render(this.scene, this.camera);
    }
}

export = WebGLView;
