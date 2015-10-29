import THREE = require('three');
import OrbitControls = require('three-orbit-controls');

import Component = require('../components/Component');

import SceneNode = require('../scene/Node');
import Model = require('../scene/Model');
import Bone = require('../scene/Bone');
import Mesh = require('../scene/Mesh');
import Grid = require('../scene/primitives/Grid');
import Axies = require('../scene/primitives/Axies');

class WebGLView extends Component {
    private renderer: THREE.WebGLRenderer = null;
    private scene: THREE.Scene = null;
    private camera: THREE.PerspectiveCamera = null;
    private controls: OrbitControls = null;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouseVector: THREE.Vector2 = new THREE.Vector2();
    private pickingObjects: THREE.Object3D[] = [];

    private timeline: Component = null;

    private model: Model = null;

    private timestamp: number;

    constructor (model: Model) {
        super('#glView');

        this.timeline = new Component('#timeline');

        this.model = model;
        this.model.childAdded((node: SceneNode) => {
            this.scene.add(node.mesh);
            this.pickingObjects.push(node.mesh);
        });
        this.model.childRemoved((node: Mesh|Bone) => {
            this.scene.remove(node.mesh);
            this.scene.remove(node.boundingBox);
            this.pickingObjects.splice(this.pickingObjects.indexOf(node.mesh), 1);
        });
        this.ready();
        this.setupPicking();

        window.addEventListener('resize', () => {
            let width = this.width,
                height = this.parent.height - this.timeline.height;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, true);
        }, false);
    }

    get rawScene(): THREE.Scene {
        return this.scene;
    }

    private ready(): void {
        let width = this.width,
            height = this.height;

        this.camera = new THREE.PerspectiveCamera( 75, width / height, 1, 100000 );
        this.camera.up.set(0, 0, 1);
        this.camera.position.set(5, 5, 6);
        //this.camera.position.z = 75;
        this.camera.lookAt(new THREE.Vector3());
        this.camera.updateProjectionMatrix();

        let orbitControls = OrbitControls(THREE);
        this.controls = new orbitControls(this.camera, this.element);
        this.controls.noKeys = true;

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
        this.element.appendChild(this.renderer.domElement);

        window.requestAnimationFrame((time: number) => { this.animate(time); });
    }

    private setupPicking(): void {
        let mouseMoved: boolean = false;
        let mouseButton: number = null;
        let mouseMove = () => {
            mouseMoved = true;
        };
        this.renderer.domElement.addEventListener('mousedown', (event: MouseEvent) => {
            mouseMoved = false;
            mouseButton = event.button;
            this.renderer.domElement.addEventListener('mousemove', mouseMove, false);
        }, false);
        this.renderer.domElement.addEventListener('mouseup', (event: MouseEvent) => {
            this.renderer.domElement.removeEventListener('mousemove', mouseMove, false);
            if (!mouseMoved && event.button === mouseButton) {
                this.mouseVector.x = ( event.offsetX / this.renderer.domElement.width ) * 2 - 1;
                this.mouseVector.y = -( event.offsetY / this.renderer.domElement.height ) * 2 + 1;

                let pickedObject = this.pickObject();
                if (pickedObject !== null) {
                    this.events.trigger('objectClicked', pickedObject, this);
                }
            }
        }, false);
    }

    private pickObject(): Mesh|Bone {
        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        let intersects = this.raycaster.intersectObjects(this.pickingObjects);
        let pickedObject: Mesh|Bone = null;
        if (intersects.length > 0) {
            let meshes: Mesh[] = this.model.meshes;
            for (let i = 0; i < meshes.length; i++) {
                if (intersects[0].object === meshes[i].mesh) {
                    pickedObject = meshes[i];
                    break;
                }
            }
            if (pickedObject === null) {
                let bones: Bone[] = this.model.bones;
                for (let i = 0; i < bones.length; i++) {
                    if (intersects[0].object === bones[i].mesh) {
                        pickedObject = bones[i];
                        break;
                    }
                }
            }
        }
        return pickedObject;
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
