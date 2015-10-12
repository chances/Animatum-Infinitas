class Node {
    parent: Node = null;
    children: Node[] = [];

    get hasChildren() {
        return this.children.length > 0;
    }

    /**
     * Add a child to this Node.
     *
     * @param node Node to add
     */
    add(node: Node) {
        this.children.push(node);
        node.parent = this;
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
}

export = Node;
