module Convert {
    export function degreesToRadians(degrees: number) {
        return degrees * (Math.PI / 180.0);
    }

    export function radiansToDegrees(radians: number) {
        return radians * (180.0 / Math.PI);
    }
}

export = Convert;
