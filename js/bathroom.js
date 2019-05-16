
class bathroom{
    constructor(_x, _y, _z, _radius, _type){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.radius = _radius;
        this.numType = _type
        if(_type == 1) this.type = "All"
        if(_type == 2) this.type = "Women"
        if(_type == 3) this.type = "Men"
    }

    draw(){
        // push();
        // translate(this.x, this.y, this.z);
        // sphere(this.radius);
        // pop();
        noStroke()
        if(this.numType == 1) fill("#FFC29F")
        else if(this.numType == 2) fill("#7B99BC")
        else if(this.numType == 3) fill("#ABE58F")
        ellipse(this.x, this.y, 8, 8)
    }
}