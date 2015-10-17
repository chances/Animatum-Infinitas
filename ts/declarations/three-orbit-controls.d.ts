declare class OrbitControls {
    constructor(camera: THREE.Camera, domElement?: HTMLElement);

    object: THREE.Camera;
    domElement: HTMLElement;

    // API

    // Set to false to disable this control
    enabled: boolean;

    // "target" sets the location of focus, where the control orbits around
    // and where it pans with respect to.
    target: THREE.Vector3;

    // center is old, deprecated; use "target" instead
    center: THREE.Vector3;

    // This option actually enables dollying in and out; left as "zoom" for
    // backwards compatibility
    noZoom: boolean;
    zoomSpeed: number;

    // Limits to how far you can dolly in and out ( PerspectiveCamera only )
    minDistance: number;
    maxDistance: number;

    // Limits to how far you can zoom in and out ( OrthographicCamera only )
    minZoom: number;
    maxZoom: number;

    // Set to true to disable this control
    noRotate: boolean;
    rotateSpeed: number;

    // Set to true to disable this control
    noPan: boolean;
    keyPanSpeed: number; // pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    autoRotate: boolean;
    autoRotateSpeed: number; // 30 seconds per round when fps is 60

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    minPolarAngle: number; // radians
    maxPolarAngle: number; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    minAzimuthAngle: number; // radians
    maxAzimuthAngle: number; // radians

    // Set to true to disable use of the keys
    noKeys: boolean;

    // The four arrow keys
    keys: { LEFT: number, UP: number, RIGHT: number, BOTTOM: number };

    // Mouse buttons
    mouseButtons: { ORBIT: number, ZOOM: number, PAN: number };
}

declare module 'three-orbit-controls' {
    function initializer(three: any): any;
    export = initializer;
}
