import THREE = require('three');

namespace Animation {
    'use strict';

    export enum KeyframeType {
        Translation,
        Rotation
    }

    export class Keyframe {
        time: number;
        type: KeyframeType;
        transformation: THREE.Vector3;

        constructor(
            time: number = 0.0,
            type: KeyframeType = KeyframeType.Translation,
            transformation: THREE.Vector3 = new THREE.Vector3()
        ) {
            this.time = time;
            this.type = type;
            this.transformation = transformation;
        }

        /**
         * Linearly interpolate the transformation of this keyframe between that of another.
         *
         * @param otherKeyframe The other keyframe with which to interpolate
         * @param currentTime The current time
         * @returns {THREE.Vector3} The linearly interpolated transformation
         */
        lerp(otherKeyframe: Keyframe, currentTime: number): THREE.Vector3 {
            let interpolatedTransform = new THREE.Vector3(),
                timeBetween = (currentTime - this.time) / (otherKeyframe.time - this.time);
            interpolatedTransform.lerpVectors(this.transformation, otherKeyframe.transformation, timeBetween);
            return interpolatedTransform;
        }
    }
}

export = Animation;
