import THREE = require('three');

class Grid {
    private rawLineWidth = 1.0;
    private rawSize = 22;
    private lightColor = new THREE.Color(0x323232);
    private lightMaterial = new THREE.LineBasicMaterial();
    private darkColor = new THREE.Color(0xA9A9A9);
    private darkMaterial = new THREE.LineBasicMaterial();
    private minorGrid: THREE.Geometry;
    private majorGrid: THREE.Geometry;
    private rawMinorLines: THREE.Line;
    private rawMajorLines: THREE.Line;
    private gridGroup: THREE.Group;

    private renderOrigin = false;

    constructor() {
        this.lightMaterial.color = this.lightColor;
        this.lightMaterial.linewidth = this.rawLineWidth;
        this.darkMaterial.color = this.darkColor;
        this.darkMaterial.linewidth = this.rawLineWidth;

        this.gridGroup = new THREE.Group();

        this.updateGrid();

        this.group.add(this.rawMinorLines);
        this.group.add(this.rawMajorLines);
    }

    get lineWidth() {
        return this.rawLineWidth;
    }

    set lineWidth(value: number) {
        this.rawLineWidth = value;

        this.updateGrid();
    }

    get size() {
        return this.rawSize;
    }

    set size(value: number) {
        this.rawSize = value;

        this.updateGrid();
    }

    get visible() {
        return this.gridGroup.visible;
    }

    set visible(value: boolean) {
        this.gridGroup.visible = value;
    }

    set renderAxies(value: boolean) {
        this.renderOrigin = value;

        this.updateGrid();
    }

    get group() {
        return this.gridGroup;
    }

    private updateGrid() {
        let minor = new THREE.Geometry(),
            major = new THREE.Geometry();

        for (let i = this.rawSize * -1; i <= this.rawSize; i++) {
            if (i === 0 && !this.renderOrigin) {
                continue;
            }

            if (i === 2 || (i - 2) % 4 === 0 ) {
                major.vertices.push(
                    new THREE.Vector3(i, this.rawSize * -1),
                    new THREE.Vector3(i, this.rawSize),
                    new THREE.Vector3(this.rawSize * -1, i),
                    new THREE.Vector3(this.rawSize, i)
                );
            } else {
                minor.vertices.push(
                    new THREE.Vector3(i, this.rawSize * -1),
                    new THREE.Vector3(i, this.rawSize),
                    new THREE.Vector3(this.rawSize * -1, i),
                    new THREE.Vector3(this.rawSize, i)
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
