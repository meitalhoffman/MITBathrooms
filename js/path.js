
// Specifies a Path Object (a sequence of points)
// inspired by Ira Winder
// written by Meital Hoffman
//
class Path {

  straightPath() {
    this.waypoints.push(this.origin);
    this.waypoints.push(this.destination);
  }
  
  // Constructs an Empy Path with waypoints yet to be included
  constructor(o, d) {
    this.origin = o;
    this.destination = d;
    this.waypoints = [];
    this.diameter = 10;
    this.straightPath();
  }
  
  solve(finder) {
    this.waypoints = finder.findPath(this.origin, this.destination);
    this.diameter = finder.network.SCALE;
  }
  
  
  display(col, alpha) {
    // Draw Shortest Path
    //
    noFill();
    strokeWeight(2);
    stroke(color("#00FF00")); // Green
    var n1, n2;
    console.log(this.waypoints)
    for (var i=1; i<this.waypoints.length; i++) {
      n1 = this.waypoints[i-1];
      n2 = this.waypoints[i];
      line(n1.x, n1.y, n2.x, n2.y);
    }
    
    // Draw Origin (Red) and Destination (Blue)
    //
    fill("#FF0000"); // Red
    ellipse(this.origin.x, this.origin.y, 10, 10);
    fill("#0000FF"); // Blue
    ellipse(this.destination.x, this.destination.y, 10, 10);
    strokeWeight(1);
  }
}

// The Pathfinder class allows one to the retreive a path ([vector]) that
// describes an optimal route.  The Pathfinder must be initialized as a graph (i.e. a network of nodes and edges).
//
class Pathfinder { 

  constructor(_network){
    this.network = _network
    //dictionary holding the parents of the node in form [child: parent, child: parent]
    this.parents = {}
  }

  getDistance(start, end){
    return sqrt(sq(start.x-end.x)+sq(start.y-end.y))
  }
  
  getClosestNode(node){
    var n = node;
    var dist = Number.MAX_VALUE
    for(let i =0; i<this.network.nodes.length; i++){
      var maybe = this.network.nodes[i]
      var checkDist = this.getDistance(maybe, node)
      if(checkDist < dist){
        n = maybe;
        dist =checkDist;
      }
    }
    return n;
  }

  visitNode(start, dest, visited, path, q){
    let newPath = path
    newPath.push(start)
    // console.log(newPath)
    // console.log(start)
    // console.log(start.neighbors)
    let nArray = Array.from(start.neighbors)
    for(let n in nArray){
      var neighbor = nArray[n]
      //neighbor hasn't been visited yet
      // console.log("visting neighbors")
      // console.log(visited.has(neighbor))
      if(!visited.has(neighbor)){
        this.parents[neighbor] = start;
        if(neighbor == dest){
          console.log("found our destination")
          path.push(neighbor)
          return path
        } else {
          // console.log("adding a path item")
          q.push(neighbor)
          // console.log("q is update to: " +String(q))
          visited.add(neighbor)
        }
      }
    }
    if(q.length == 0){
      return -1
    }
    return this.visitNode(q.shift(), dest, visited, path, q)
  }

  findPath(origin, destination){
    var o = this.getClosestNode(origin)
    var d = this.getClosestNode(destination)
    // print(o)
    // print(d)
    var path = []
    var queue = []
    var visited = new Set()
    this.parents[o] = o
    var result = this.visitNode(o, d, visited, path, queue)
    console.log(result)
    if(result == -1){
      return []
    }
    var finalPath = []
    var completed = false;
    var current = d
    while(!completed){
      finalPath.push(current);
      console.log(finalPath)
      if(current == o){
        completed = true;
      } else {      
        // console.log(this.parents[current])
        finalPath.unshift(this.parents[current])
        current = this.parents[current]
        // completed = true
      }
    }
    return finalPath
  }

}