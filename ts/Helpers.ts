import THREE = require('three');
import Promise = require("bluebird");

import Convert = require('./Convert');

module Helpers {

    export function delay(time: number): Promise<Object> {
        return new Promise(function (resolve) {
            window.setTimeout(function () {
                resolve(null);
            }, time);
        });
    }

    export interface Interval {
        intervalId: number;
        clear: () => void;
    }

    //Interval utility function
    export function interval(func: () => void, time: number): Interval {
        var interval = window.setInterval(func, time);
        return {
            intervalId: interval,
            clear: function () { window.clearInterval(interval); }
        };
    }

    export function randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    export function vertexRotateTransform(vertex: THREE.Vector3, focalPoint: THREE.Vector3, rotation: THREE.Vector3) {
        let rotationRadians = new THREE.Vector3(
            Convert.degreesToRadians(rotation.x),
            Convert.degreesToRadians(rotation.y),
            Convert.degreesToRadians(rotation.z)
        );
        return vertexRotateRadianTransform(vertex, focalPoint, rotationRadians);
    }

    export function vertexRotateRadianTransform(vertex: THREE.Vector3, focalPoint: THREE.Vector3, rotation: THREE.Vector3) {
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

    export function objectIsA(object: any, type: any) {
        if (type.hasOwnProperty("prototype")) {
            return object.constructor.name === type.prototype.constructor.name;
        } else {
            return false;
        }
    }
}

export = Helpers;
