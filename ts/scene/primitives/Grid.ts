import THREE = require('three');

class Grid {
    private lineWidth = 1.0;
    private size = 20;
    private lightColor = new THREE.Color(0x323232);
    private lightMaterial = new THREE.LineBasicMaterial();
    private darkColor = new THREE.Color(0xA9A9A9);
    private darkMaterial = new THREE.LineBasicMaterial();
    private minorGrid: THREE.Geometry;
    private majorGrid: THREE.Geometry;
    private rawMinorLines: THREE.Line;
    private rawMajorLines: THREE.Line;
    private gridGroup: THREE.Group;

    private renderOrigin = true;

    constructor() {
        this.lightMaterial.color = this.lightColor;
        this.lightMaterial.linewidth = this.lineWidth;
        this.darkMaterial.color = this.darkColor;
        this.darkMaterial.linewidth = this.lineWidth;

        this.gridGroup = new THREE.Group();

        this.updateGrid();

        this.group.add(this.rawMinorLines);
        this.group.add(this.rawMajorLines);
    }

    get group() {
        return this.gridGroup;
    }

    private updateGrid() {
        let minor = new THREE.Geometry(),
            major = new THREE.Geometry();

        for (let i = this.size * -1; i <= this.size; i++) {
            if (i === 0 && !this.renderOrigin) {
                continue;
            }

            if (i === 2 || (i - 2) % 4 === 0 ) {
                major.vertices.push(
                    new THREE.Vector3(i, this.size * -1),
                    new THREE.Vector3(i, this.size),
                    new THREE.Vector3(this.size * -1, i),
                    new THREE.Vector3(this.size, i)
                );
            } else {
                minor.vertices.push(
                    new THREE.Vector3(i, this.size * -1),
                    new THREE.Vector3(i, this.size),
                    new THREE.Vector3(this.size * -1, i),
                    new THREE.Vector3(this.size, i)
                );
            }
        }

        this.minorGrid = minor;
        this.majorGrid = major;

        this.rawMinorLines = new THREE.LineSegments(minor, this.lightMaterial);
        this.rawMajorLines = new THREE.LineSegments(major, this.darkMaterial);
    }
}

export = Grid;
