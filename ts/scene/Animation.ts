import THREE = require('three');

module Animation {

    export enum KeyframeType {
        Translation,
        Rotation
    }

    export class Keyframe {

        constructor(
            public time: number = 0.0,
            public type: KeyframeType = KeyframeType.Translation,
            public transformation: THREE.Vector3 = new THREE.Vector3
        ) {}
    }
}

export = Animation;
