import fs = require('fs');

import parser = require('./../../parser/parser');

import GeomObject = require('./GeomObject');

class ASEModel {

    geomObjects: GeomObject[] = [];

    constructor(file: string) {
        let parsedFile = parser.parse(fs.readFileSync(file, 'utf8'));

        this.parse(parsedFile);
    }

    private parse(ast: any): void {
        ast.forEach((node: any) => {
            switch (node.type) {
                case 'GEOMOBJECT':
                    this.geomObjects.push(this.parseGeomObject(node));
                    break;
                default:
                    return;
            }
        });
    }

    private parseGeomObject(obj: any): GeomObject {
        let geomObj = new GeomObject(this.getName(obj));
        geomObj.mesh = this.getMesh(obj);

        return geomObj;
    }

    private getName(obj: any): string {
        for (let i = 0; i < obj.children.length; i += 1) {
            if (obj.children[i].type === 'NODE_NAME') {
                return obj.children[i].value;
            }
        }
        return null;
    }

    private getMesh(obj: any): Mesh {
        for (let i = 0; i < obj.children.length; i += 1) {
            if (obj.children[i].type === 'MESH') {
                let mesh = {
                    vertices: this.getVertices(obj.children[i]),
                    faces: this.getFaces(obj.children[i]),
                };
                this.getTextureCoordinates(obj.children[i], mesh.vertices);
                this.getNormals(obj.children[i], mesh.vertices, mesh.faces);
                return mesh;
            }
        }
        return null;
    }

    private getVertices(mesh: any): Vertex[] {
        let vertices: Vertex[] = [];
        for (let i = 0; i < mesh.children.length; i += 1) {
            if (mesh.children[i].type === 'MESH_VERTEX_LIST') {
                for (let v = 0; v < mesh.children[i].children.length; v++) {
                    vertices.push({
                        x: <number>(mesh.children[i].children[v].x),
                        y: <number>(mesh.children[i].children[v].y),
                        z: <number>(mesh.children[i].children[v].z)
                    });
                }
            }
        }
        return vertices;
    }

    private getFaces(mesh: any): Face[] {
        let faces: Face[] = [];
        for (let i = 0; i < mesh.children.length; i += 1) {
            if (mesh.children[i].type === 'MESH_FACE_LIST') {
                for (let v = 0; v < mesh.children[i].children.length; v++) {
                    faces.push({
                        a: <number>(mesh.children[i].children[v].a),
                        b: <number>(mesh.children[i].children[v].b),
                        c: <number>(mesh.children[i].children[v].c)
                    });
                }
            }
        }
        return faces;
    }

    private getTextureCoordinates(mesh: any, vertices: Vertex[]): void {
        for (let i = 0; i < mesh.children.length; i += 1) {
            if (mesh.children[i].type === 'MESH_TVERTLIST') {
                for (let v = 0; v < mesh.children[i].children.length; v++) {
                    vertices[mesh.children[i].children[v].index].textureCoordinates = {
                        u: mesh.children[i].children[v].x,
                        v: mesh.children[i].children[v].y
                    };
                }
            }
        }
    }

    private getNormals(mesh: any, vertices: Vertex[], faces: Face[]): void {
        for (let i = 0; i < mesh.children.length; i += 1) {
            if (mesh.children[i].type === 'MESH_NORMALS') {
                for (let v = 0; v < mesh.children[i].children.length; v++) {
                    if (mesh.children[i].children[v].type === 'MESH_FACENORMAL') {
                        faces[mesh.children[i].children[v].index].normal = {
                            x: mesh.children[i].children[v].x,
                            y: mesh.children[i].children[v].y,
                            z: mesh.children[i].children[v].z
                        };
                    } else if (mesh.children[i].children[v].type === 'MESH_VERTEXNORMAL') {
                        vertices[mesh.children[i].children[v].index].normal = {
                            x: mesh.children[i].children[v].x,
                            y: mesh.children[i].children[v].y,
                            z: mesh.children[i].children[v].z
                        };
                    }
                }
            }
        }
    }
}

export = ASEModel;
