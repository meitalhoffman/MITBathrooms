// var Node = require('./Node');

/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * */
class Grid {
    /* *
    * @constructor
    * @param {number} width Number of columns of the grid.
    * @param {number} height Number of rows of the grid.
    * @param {Array.<Array.<(number|boolean)>>} [matrix] - A 0-1 matrix
    *     representing the walkable status of the nodes(0 or false for walkable).
    *     If the matrix is not supplied, all the nodes will be walkable.  
    * */
    constructor(width, height, matrix){
        /**
         * The number of columns of the grid.
         * @type number
         */
        this.width = width;
        /**
         * The number of rows of the grid.
         * @type number
         */
        this.height = height;

        this.matrix = matrix;

        /**
         * A 2D array of nodes.
         */
        this.nodes = this.buildNodes(width, height, matrix);
    }

    /**
     * Build and return the nodes.
     * @private
     * @param {number} width
     * @param {number} height
     * @param {Array.<Array.<number|boolean>>} [matrix] - A 0-1 matrix representing
     *     the walkable status of the nodes.
     * @see Grid
     */
    buildNodes(width, height, matrix) {
        var i, j,
            nodes = new Array(height),
            row;

        for (i = 0; i < height; ++i) {
            nodes[i] = new Array(width);
            for (j = 0; j < width; ++j) {
                nodes[i][j] = new Node(j, i, 0); // z == 0 in 2D
            }
        }

        if (matrix === undefined) {
            matrix = [];
            for (i = 0; i < height; ++i) {
                matrix.push([]);
                for (j = 0; j < width; ++j) {
                    matrix[i][j] = 0; // 0 => walkable
                }
            }
            this.matrix = matrix;
        }

        if (matrix.length !== height || matrix[0].length !== width) {
            throw new Error('Matrix size does not fit');
        }

        for (i = 0; i < height; ++i) {
            for (j = 0; j < width; ++j) {
                if (!matrix[i][j]) { // 0 => walkable
                    var n = nodes[i][j];
                    // Add neighbors if they are walkable
                    if(i!=0        && !matrix[i-1][j]) n.neighbors.push(nodes[i-1][j]);
                    if(i!=height-1 && !matrix[i+1][j]) n.neighbors.push(nodes[i+1][j]);
                    if(j!=0        && !matrix[i][j-1]) n.neighbors.push(nodes[i][j-1]);
                    if(j!=width-1  && !matrix[i][j+1]) n.neighbors.push(nodes[i][j+1]);
                }
            }
        }

        return nodes;
    };

    
    getNodeAt(x, y) {
        return this.nodes[y][x];
    };


    /**
     * Determine whether the node at the given position is walkable.
     * (Also returns false if the position is outside the grid.)
     * @param {number} x - The x coordinate of the node.
     * @param {number} y - The y coordinate of the node.
     * @return {boolean} - The walkability of the node.
     */
    isWalkableAt(x, y) {
    return this.isInside(x, y) && this.matrix[y][x]==0;
    };


    /**
     * Determine whether the position is inside the grid.
     * XXX: `grid.isInside(x, y)` is wierd to read.
     * It should be `(x, y) is inside grid`, but I failed to find a better
     * name for this method.
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isInside(x, y) {
        return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
    };


    /**
     * Set whether the node on the given position is walkable.
     * NOTE: throws exception if the coordinate is not inside the grid.
     * @param {number} x - The x coordinate of the node.
     * @param {number} y - The y coordinate of the node.
     * @param {boolean} walkable - Whether the position is walkable.
     */
    setWalkableAt (x, y, walkable) {
        //this.nodes[y][x].walkable = walkable;
        this.matrix[y][x] = walkable ? 0 : 1;
        this.nodes = this.buildNodes(this.width,this.height,this.matrix);
    };


    /**
     * Get the neighbors of the given node.
     *
     *     offsets      diagonalOffsets:
     *  +---+---+---+    +---+---+---+
     *  |   | 0 |   |    | 0 |   | 1 |
     *  +---+---+---+    +---+---+---+
     *  | 3 |   | 1 |    |   |   |   |
     *  +---+---+---+    +---+---+---+
     *  |   | 2 |   |    | 3 |   | 2 |
     *  +---+---+---+    +---+---+---+
     *
     *  When allowDiagonal is true, if offsets[i] is valid, then
     *  diagonalOffsets[i] and
     *  diagonalOffsets[(i + 1) % 4] is valid.
     * @param {Node} node
     * @param {boolean} allowDiagonal
     * @param {boolean} dontCrossCorners
     */
    getNeighbors(node) {
        return node.neighbors;
    };

    getClosestNode(x, y){
        var scaledX = round(x/scaleFactor)
        var scaledY = round(y/scaleFactor)
        if(this.isWalkableAt(scaledX, scaledY)) return this.getNodeAt(scaledX, scaledY)
        else {
            let nbs = this.getNeighbors(this.getNodeAt(scaledX, scaledY))
            for(n in nbs){
                if(this.isWalkableAt(nbs[n].x, nbs[n].y)) return nbs[n]
            }
        }

    }

    /**
     * Get a clone of this grid.
     * @return {Grid} Cloned grid.
     */
    clone() {
        var i, j,

            width = this.width,
            height = this.height,
            thisNodes = this.nodes,

            newGrid = new Grid(width, height),
            row;

        for (i = 0; i < height; ++i) {
            for (j = 0; j < width; ++j) {

                // Must use the Node objects generated by newGrid! Otherwise the pathfinding algos won't be able to compare endNode===someNode
                var n = newGrid.getNodeAt(j,i);
                let oldNode = this.getNodeAt(j,i);
                n.neighbors = [];
                for(var k=0; k<oldNode.neighbors.length; k++)
                    n.neighbors.push(newGrid.getNodeAt(oldNode.neighbors[k].x, oldNode.neighbors[k].y));
            }
        }

        return newGrid;
    };

    draw(){
        var i, j,

        width = this.width,
        height = this.height;

    for (i = 0; i < width; ++i) {
        for (j = 0; j < height; ++j) {
            // console.log("drawing")
            let n = this.getNodeAt(i, j)
            // console.log(this.isWalkableAt(i,j))
            if(this.isWalkableAt(i, j)) {
                stroke(255)
                fill(255)
            }
            else {
                stroke(0)
                fill(0)
            }
            rect(n.x*scaleFactor, n.y*scaleFactor, 2, 2)
            } 
        }
        
        
        // Draw Origin (Red) and Destination (Blue)
        //

        // fill("#0000FF"); // Blue
        // ellipse(this.destination.x, this.destination.y, 10, 10);
        // strokeWeight(1);
    }
}