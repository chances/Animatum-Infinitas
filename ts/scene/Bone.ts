import THREE = require('three');

import Helpers = require('../Helpers');

import Node = require('./Node');
import Mesh = require('./Mesh');
import Animation = require('./Animation');
import Sphere = require('./primitives/Sphere');

class Bone extends Node {
    name: string = '';
    animation: Animation.Keyframe[] = [];

    private translate: THREE.Vector3 = null;
    private rotate: THREE.Vector3 = null;
    private assignedMeshes: Mesh[] = [];
    private sphere: Sphere = null;

    constructor(object?: any) {
        super();

        if (object) {
            this.name = object.name;
            //this.color = Colors.Random();
            this.color = new THREE.Color('blue');
            let v = object.mesh.verticies[0];
            this.position = new THREE.Vector3(v.x, v.y, v.z);
            this.translate = new THREE.Vector3();

            // Create visual representation
            this.sphere = this.makeSphere();
        }
    }

    get position(): THREE.Vector3 {
        if (this.sphere) {
            return this.sphere.mesh.position;
        }

        return null;
    }

    set position(value: THREE.Vector3) {
        if (this.sphere) {
            this.sphere.mesh.position = value;
        }
    }

    get translation() {
        return this.translate;
    }

    set translation(value: THREE.Vector3) {
        this.translate = value;
        this.sphere.mesh.position = this.position.add(this.translate);
    }

    get rotation() {
        return this.rotate;
    }

    set rotation(value: THREE.Vector3) {
        this.rotate = value;
    }

    get transformedPosition() {
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
        if (this.sphere) {
            return this.sphere.color;
        }
        return null;
    }

    set color(value: THREE.Color) {
        this.sphere.color = value;
    }

    get meshes() {
        return this.assignedMeshes;
    }

    get animationSortedByTime(): Animation.Keyframe[] {
        return this.animation.sort((a: Animation.Keyframe, b: Animation.Keyframe) => {
            return a.time - b.time;
        });
    }

    get leftmostKeyframe() {
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

    get rightmostKeyframe() {
        let keyframes = this.animationSortedByTime;
        return keyframes[keyframes.length - 1];
    }

    get rightmostTranslationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        for (let i = keyframes.length - 1; i > -1; i++) {
            if (keyframes[i].type === Animation.KeyframeType.Translation) {
                return keyframes[i];
            }
        }

        return null;
    }

    get rightmostRotationKeyframe(): Animation.Keyframe {
        let keyframes = this.animationSortedByTime;
        for (let i = keyframes.length - 1; i > -1; i++) {
            if (keyframes[i].type === Animation.KeyframeType.Rotation) {
                return keyframes[i];
            }
        }

        return null;
    }

    getKeyframeLeftOfTime(time: number, type: Animation.KeyframeType) {
        let keyframes = this.animationSortedByTime;
        let keyframeLeftOfTime: Animation.Keyframe = null;
        for (let i = 0; i < keyframes.length; i++) {
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

    getKeyframeRightOfTime(time: number, type: Animation.KeyframeType) {
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

    toString() {
        return this.name;
    }

    private makeSphere(): Sphere {
        return new Sphere(this.position.add(this.translate), 1.0 * 0.15, 6, this.color);
    }

    private parentTranslationDiff(bone: Bone) {
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
