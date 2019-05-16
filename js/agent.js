
class agent{
    constructor(_startX, _startY, _grid, _pref){
        this.x = _startX
        this.y = _startY
        this.grid = _grid
        // let closest = getClosestBathroom(this.x, this.y)
        // this.destX = closest[0]
        // this.destY = closest[1]
                this.destX = 0
        this.destY = 0
        this.pref = _pref
        if(this.pref == 1){
            this.c = neutralC
        } else if(this.pref == 2){
            this.c = femaleC
        } else if(this.pref == 3){
            this.c = maleC
        }
        this.placing = true;
        this.path = []
    }

    draw(_x, _y){
        strokeWeight(1)
        stroke(255)
        fill(this.c)
        if(this.placing) {
            // console.log("placing the agent")
            rect(_x - 10 + random(2.5 * agents.length), _y - 10 + random(2.5 * agents.length), 20, 20)
        } else {
            rect(this.x-5, this.y-5, 10, 10)
        }
    }

    drawPath(){
        stroke(this.c); // Green
        fill(this.c);
            var n1, n2;
        for (var i=1; i<this.path.length; i++) {
                stroke(this.c); // Green
                strokeWeight(2)
                n1 = this.path[i-1];
                n2 = this.path[i];
                line(n1[0]*scaleFactor, n1[1]*scaleFactor, n2[0]*scaleFactor, n2[1]*scaleFactor);
        }
    }

    placeStart(startx, starty){
        console.log(startx)
        console.log(starty)
        if(agents.length > 1){
            if(this.pref == 1){
                this.x = startx
                this.y = starty
            }
            if(this.pref == 2){
                this.x = startx + 2
                this.y = starty
            }
            if(this.pref == 3){
                this.x = startx + 4
                this.y = starty
            }
        } else {
            this.x = startx
            this.y = starty
        }
        this.placing = false
    }

}