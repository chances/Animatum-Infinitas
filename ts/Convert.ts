namespace Convert {
    'use strict';

    export function degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180.0);
    }

    export function radiansToDegrees(radians: number): number {
        return radians * (180.0 / Math.PI);
    }
}

export = Convert;
