
//network class of nodes and bathrooms
//object that agents will walk on and use to find shortest paths
class mesh{
    constructor(_bathrooms, _nodes){
        this.bath = _bathrooms
        this.nodes = _nodes
        this.SCALE = 5
    }

    draw(){
        // fill(0)
        for(let n in this.nodes){
            nodes[n].draw()
        }
    }

    getNeighborCount(nodeIndex){
        return this.nodes[nodeIndex].neighbors.size;
    }

    getNodeNeighbor(current, i){

    }

}