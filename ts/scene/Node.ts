import Events = require('../Bridge');

class Node {
    parent: Node = null;
    children: Node[] = [];

    constructor(protected events: Events.Bridge = new Events.Bridge()) {}

    get hasChildren() {
        return this.children.length > 0;
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

    change(callback: Events.BridgeCallback<Node>): Node {
        this.events.on('nodeChanged', (node: Node) => {
            callback.call(this, node);
        });

        return this;
    }
}

export = Node;
