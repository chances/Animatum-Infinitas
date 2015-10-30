import THREE = require('three');
import randomColor = require('randomcolor');

import Helpers = require('../Helpers');

import GeomObject = require('./../services/GeomObject');

import SceneNode = require('./Node');
import Mesh = require('./Mesh');
import Animation = require('./Animation');
import Sphere = require('./primitives/Sphere');

class Bone extends SceneNode {
    name: string = '';
    animation: Animation.Keyframe[] = [];

    private translate: THREE.Vector3 = null;
    private rotate: THREE.Vector3 = null;
    private assignedMeshes: Mesh[] = [];
    private sphere: Sphere = null;
    private bounds: THREE.BoxHelper = null;

    constructor(object: GeomObject) {
        super(null);

        this.name = object.name;
        this.translate = new THREE.Vector3();

        // Create visual representation
        let v = object.mesh.vertices[0];
        let position = new THREE.Vector3(v.x, v.y, v.z);
        this.sphere = new Sphere(position.add(this.translate), 1.0 * 0.15, 6, new THREE.Color(randomColor()));
        this.bounds = new THREE.BoxHelper(this.sphere.mesh);
    }

    get position(): THREE.Vector3 {
        return this.sphere.mesh.position;
    }

    set position(value: THREE.Vector3) {
        this.sphere.mesh.position = value;

        this.events.trigger('nodeChanged', this, this);
    }

    get translation(): THREE.Vector3 {
        return this.translate;
    }

    set translation(value: THREE.Vector3) {
        this.translate = value;
        this.sphere.mesh.position = this.position.add(this.translate);

        this.events.trigger('nodeChanged', this, this);
    }

    get rotation(): THREE.Vector3 {
        return this.rotate;
    }

    set rotation(value: THREE.Vector3) {
        this.rotate = value;

        this.events.trigger('nodeChanged', this, this);
    }

    get transformedPosition(): THREE.Vector3 {
        let transform = this.position.add(this.translation);
        let parent: Bone = <Bone>this.parent;
        if (parent && Helpers.objectIsA(parent, Bone)) {
            transform.add(this.parentTranslationDiff(this));
            transform = Helpers.vertexRotateTransform(
                transform, parent.transformedPosition, parent.rotation);
        }

        return transform;
    }

    get color(): THREE.Color {
        return this.sphere.color;
    }

    set color(value: THREE.Color) {
        this.sphere.color = value;

        this.events.trigger('nodeChanged', this, this);
    }

    get mesh(): THREE.Mesh {
        return <THREE.Mesh>this.sphere.mesh;
    }

    get boundingBox(): THREE.BoxHelper {
        return this.bounds;
    }

    get meshes(): Mesh[] {
        return this.assignedMeshes;
    }

    get animationSortedByTime(): Animation.Keyframe[] {
        return this.animation.sort((a: Animation.Keyframe, b: Animation.Keyframe) => {
            return a.time - b.time;
        });
    }

    get leftmostKeyframe(): Animation.Keyframe {
        return this.animationSortedByTime[0];
    }

    get leftmostTranslationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        keyframes.forEach((keyframe: Animation.Keyframe) => {
            if (keyframe.type === Animation.KeyframeType.Translation) {
                return keyframe;
            }
        });

        return null;
    }

    get leftmostRotationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        keyframes.forEach((keyframe: Animation.Keyframe) => {
            if (keyframe.type === Animation.KeyframeType.Rotation) {
                return keyframe;
            }
        });

        return null;
    }

    get rightmostKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        return keyframes[keyframes.length - 1];
    }

    get rightmostTranslationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        for (let i = keyframes.length - 1; i > -1; i += 1) {
            if (keyframes[i].type === Animation.KeyframeType.Translation) {
                return keyframes[i];
            }
        }

        return null;
    }

    get rightmostRotationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        for (let i = keyframes.length - 1; i > -1; i += 1) {
            if (keyframes[i].type === Animation.KeyframeType.Rotation) {
                return keyframes[i];
            }
        }

        return null;
    }

    getKeyframeLeftOfTime(time: number, type: Animation.KeyframeType): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        let keyframeLeftOfTime: Animation.Keyframe = null;
        for (let i = 0; i < keyframes.length; i += 1) {
            if (keyframes[i].type === type) {
                if (time >= keyframes[i].time) {
                    keyframeLeftOfTime = keyframes[i];
                } else {
                    break;
                }
            }
        }

        return keyframeLeftOfTime;
    }

    getKeyframeRightOfTime(time: number, type: Animation.KeyframeType): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        let keyframeRightOfTime: Animation.Keyframe = null;
        for (let i = keyframes.length - 1; i > -1; i--) {
            if (keyframes[i].type === type) {
                if (time <= keyframes[i].time) {
                    keyframeRightOfTime = keyframes[i];
                } else {
                    break;
                }
            }
        }

        return keyframeRightOfTime;
    }

    toString(): string {
        return this.name;
    }

    private parentTranslationDiff(bone: Bone): THREE.Vector3 {
        let diff = new THREE.Vector3(0, 0, 0);
        let parent: Bone = <Bone>bone.parent;
        if (parent && Helpers.objectIsA(parent, Bone)) {
            diff.add(this.parentTranslationDiff(parent));
            diff.add(parent.translation);
        }

        return diff;
    }
}

export = Bone;
