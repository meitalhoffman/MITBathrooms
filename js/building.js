//class to hold the information about each building
class Building {
    constructor(_coordinates, _name, _number, _fill, _stroke) {
        this.coordinates = _coordinates;
        this.name = _name;
        this.number = _number;
        this.fill = _fill;
    }
    //Making the shape to draw
    makeShape() {
        fill(this.fill);
        stroke(0);
        strokeWeight(.5);
        beginShape();
        for (let i = 0; i < this.coordinates.length; i++) {
            let screenLocation = getScreenLocation(this.coordinates[i]);
            vertex(screenLocation[0], screenLocation[1]);
        }
        endShape();
    }
    //Drawing shape
    draw() {
        // console.log("drawing building")
        // this.makeShape();
        beginShape();
        for (let i = 0; i < this.coordinates.length; i++) {
            let screenLocation = getScreenLocation(this.coordinates[i]);
            // console.log(screenLocation)
            vertex(screenLocation[0], screenLocation[1]);
        }
        endShape();
    }
}
