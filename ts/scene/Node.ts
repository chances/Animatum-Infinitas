import Events = require('../Bridge');

class Node {
    parent: Node = null;
    children: Node[] = [];

    constructor(protected events: Events.Bridge = new Events.Bridge()) {}

    get hasChildren() {
        return this.children.length > 0;
    }

    get mesh(): THREE.Mesh {
        return null;
    }

    /**
     * Add a child to this Node.
     *
     * @param node Node to add
     * @returns {Node}
     */
    add(node: Node) {
        this.children.push(node);
        node.parent = this;

        if (node.events === null) {
            node.events = this.getRootNode().events;
        }

        this.events.trigger('nodeChanged', this, this);
        this.events.trigger('nodeAdded', node, this);

        return this;
    }

    /**
     * Remove a child from this Node.
     *
     * @param node Node to remove
     * @returns {Node} Removed Node
     */
    remove(node: Node): Node {
        node.parent = null;

        this.children.forEach((child: Node, index: number) => {
            if (node === child) {
                this.children.splice(index, 1);
                this.events.trigger('nodeChanged', this, this);
                this.events.trigger('nodeRemoved', node, this);
                return node;
            }
        });

        return null;
    }

    /**
     * Get the root node of the scene graph containing this Node.
     *
     * @returns {Node}
     */
    getRootNode(): Node {
        let node = this;
        while (node.parent !== null) {
            node = node.parent;
        }
        return node;
    }

    contains(node: Node): boolean {
        this.children.forEach((child: Node) => {
            if (child === node) {
                return true;
            } else if (child.contains(node)) {
                return true;
            }
        });

        return false;
    }

    change(callback: Events.BridgeCallback<Node>): Node {
        this.events.on('nodeChanged', (node: Node) => {
            callback.call(this, node);
        });

        return this;
    }

    childAdded(callback: Events.BridgeCallback<Node>): Node {
        this.events.on('nodeAdded', (node: Node) => {
            callback.call(this, node);
        });

        return this;
    }

    childRemoved(callback: Events.BridgeCallback<Node>): Node {
        this.events.on('nodeRemoved', (node: Node) => {
            callback.call(this, node);
        });

        return this;
    }
}

export = Node;
