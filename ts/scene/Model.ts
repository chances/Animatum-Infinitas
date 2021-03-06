import THREE = require('three');

import Helpers = require('../Helpers');
import Events = require('../Bridge');

import SceneNode = require('./Node');
import Bone = require('./Bone');
import Mesh = require('./Mesh');
import Animation = require('./Animation');

class Model extends SceneNode {
    private curTime: number = 0.0;

    constructor() {
        super();
    }

    get currentTime(): number {
        return this.curTime;
    }

    set currentTime(value: number) {
        this.curTime = value;
        this.updateMeshTransforms();
        this.events.trigger('currentTimeChanged', this.curTime, this);
    }

    get meshes(): Mesh[] {
        let meshes: Mesh[] = [];
        this.getMeshes(this, meshes);
        return meshes;
    }

    get bones(): Bone[] {
        let bones: Bone[] = [];
        this.getBones(this, bones);
        return bones;
    }

    get bonesWithKeyframesLength(): number {
        return this.countBonesWithKeyframes(this);
    }

    clear(): void {
        this.meshes.forEach((mesh: Mesh) => {
            mesh.parent.remove(mesh);
        });
        this.bones.forEach((bone: Bone) => {
            if (bone.parent) {
                bone.parent.remove(bone);
            }
        });
    }

    isMeshAssigned(mesh: Mesh, node: SceneNode): boolean {
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Bone)) {
                (<Bone>child).meshes.forEach((assignedMesh: Mesh) => {
                    if (assignedMesh === mesh) {
                        return true;
                    }
                });
            }
        });
        return false;
    }

    currentTimeChanged(callback: Events.BridgeCallback<number>): Model {
        this.events.on('currentTimeChanged', (time: number) => {
            callback.call(this, time);
        });

        return this;
    }

    animationEnded(callback: Events.BridgeCallback<Model>): Model {
        this.events.on('animationEnded', (model: Model) => {
            callback.call(this, model);
        });

        return this;
    }

    private updateMeshTransforms(): void {
        let endCount = 0;
        this.bones.forEach((bone: Bone) => {
            let translation = bone.translation;
            let rotation = new THREE.Vector3();

            if (bone.animation.length === 1) {
                let keyframe = bone.animation[0];
                if (keyframe.type === Animation.KeyframeType.Translation) {
                    translation = keyframe.transformation;
                } else {
                    rotation = keyframe.transformation;
                }
            } else if (bone.animation.length > 1) {
                // Get the keyframes sorted by time
                let keyframes: Animation.Keyframe[] = bone.animationSortedByTime;
                /*
                /* If the current time is less than, or equal
                /*  to the first keyframe's time, set the
                /*  transformation to that keyframe's
                /*  transformation. Else, calculate the in between.
                */
                if (this.curTime <= keyframes[0].time) {
                    let leftTranslate = bone.leftmostTranslationKeyframe;
                    if (leftTranslate !== null) {
                        translation = leftTranslate.transformation;
                    }
                    let leftRotate = bone.leftmostRotationKeyframe;
                    if (leftRotate !== null) {
                        rotation = leftRotate.transformation;
                    }
                } else if (this.curTime >= keyframes[keyframes.length - 1].time) {
                    let rightTranslate = bone.rightmostTranslationKeyframe;
                    if (rightTranslate !== null) {
                        translation = rightTranslate.transformation;
                    }
                    let rightRotate = bone.rightmostRotationKeyframe;
                    if (rightRotate !== null) {
                        rotation = rightRotate.transformation;
                    }

                    endCount++;
                } else {
                    // Translation in between
                    let left = bone.getKeyframeLeftOfTime(this.curTime, Animation.KeyframeType.Translation);
                    let right = bone.getKeyframeRightOfTime(this.curTime, Animation.KeyframeType.Translation);
                    if (left !== null && right === null) {
                        translation = left.transformation;
                    } else if (left === null && right !== null) {
                        translation = right.transformation;
                    } else if (left !== null && right !== null) {
                        translation = left.lerp(right, this.curTime);
                    }

                    // Rotation in between
                    left = bone.getKeyframeLeftOfTime(this.curTime, Animation.KeyframeType.Rotation);
                    right = bone.getKeyframeRightOfTime(this.curTime, Animation.KeyframeType.Rotation);
                    if (left !== null && right === null) {
                        translation = left.transformation;
                    } else if (left === null && right !== null) {
                        translation = right.transformation;
                    } else if (left !== null && right !== null) {
                        translation = left.lerp(right, this.curTime);
                    }
                }
            }

            bone.translation = translation;
            bone.rotation = rotation;
            bone.meshes.forEach((mesh: Mesh) => {
                mesh.bone = bone;
            });
        });

        if (endCount === this.bonesWithKeyframesLength) {
            this.events.trigger('animationEnded', this, this);
        }
    }

    private getMeshes(node: SceneNode, meshes: Mesh[]): void {
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Mesh)) {
                meshes.push(<Mesh>child);
                this.getMeshes(child, meshes);
            }
        });
    }

    private getBones(node: SceneNode, bones: Bone[]): void {
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Bone)) {
                bones.push(<Bone>child);
                this.getBones(child, bones);
            }
        });
    }

    private countMeshes(node: SceneNode): number {
        let count = 0;
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Mesh)) {
                count++;
                count += this.countMeshes(child);
            }
        });
        return count;
    }

    private countBones(node: SceneNode): number {
        let count = 0;
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Bone)) {
                count++;
                count += this.countBones(child);
            }
        });
        return count;
    }

    private countBonesWithKeyframes(node: SceneNode): number {
        let count = 0;
        node.children.forEach((child: SceneNode) => {
            if (Helpers.objectIsA(child, Bone) && (<Bone>child).animation.length > 0) {
                count++;
                count += this.countBonesWithKeyframes(child);
            }
        });
        return count;
    }
}

export = Model;
