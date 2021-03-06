import THREE = require('three');

import Convert = require('./Convert');

namespace Helpers {
    'use strict';

    export function delay(time: number): PinkySwear.Promise {
        let promise = pinkySwear();
        window.setTimeout(function (): void {
            promise(true);
        }, time);
        return promise;
    }

    export interface Interval {
        intervalId: number;
        clear: () => void;
    }

    //Interval utility function
    export function interval(func: () => void, time: number): Interval {
        let interval = window.setInterval(func, time);
        return {
            intervalId: interval,
            clear: function (): void { window.clearInterval(interval); }
        };
    }

    export function randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Borrowed from https://24ways.org/2010/calculating-color-contrast/
    export function getContrastYIQ(hexColor: string): string {
        let r = parseInt(hexColor.substr(0,2),16),
            g = parseInt(hexColor.substr(2,2),16),
            b = parseInt(hexColor.substr(4,2),16),
            yiq = ((r*299)+(g*587)+(b*114))/1000;

        return (yiq >= 128) ? 'black' : 'white';
    }

    export function vertexRotateTransform(
        vertex: THREE.Vector3,
        focalPoint: THREE.Vector3,
        rotation: THREE.Vector3): THREE.Vector3 {

        let rotationRadians = new THREE.Vector3(
            Convert.degreesToRadians(rotation.x),
            Convert.degreesToRadians(rotation.y),
            Convert.degreesToRadians(rotation.z)
        );
        return vertexRotateRadianTransform(vertex, focalPoint, rotationRadians);
    }

    export function vertexRotateRadianTransform(
        vertex: THREE.Vector3,
        focalPoint: THREE.Vector3,
        rotation: THREE.Vector3): THREE.Vector3 {

        let transform = new THREE.Matrix4();
        let transformedVertex = new THREE.Vector3().copy(vertex);
        transform.setPosition(vertex);

        transform.multiply(
            new THREE.Matrix4().makeTranslation(
                focalPoint.x * -1, focalPoint.y * -1, focalPoint.z * -1
            )
        );
        transform.multiply(
            new THREE.Matrix4().makeRotationFromEuler(
                new THREE.Euler(rotation.x, rotation.y, rotation.z)
            )
        );
        transform.multiply(
            new THREE.Matrix4().makeTranslation(
                focalPoint.x, focalPoint.y, focalPoint.z
            )
        );

        return transformedVertex.applyMatrix4(transform);
    }

    export function objectIsA(object: any, type: any): boolean {
        if (type.hasOwnProperty('prototype')) {
            return object.constructor.name === type.prototype.constructor.name;
        } else {
            return false;
        }
    }
}

export = Helpers;
