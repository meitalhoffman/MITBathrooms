
/*
This file is used to create the interactive bathroom game
This is the final project for 11.s195, Computation Urban Science Workshop
Created by: Meital Hoffman
Created on: 5/2/2019
*/
var buildingData;
var rasterData;
var bathroomData

var buildingFill;
var buildingStroke;

var minX, maxX, minY, maxY;
var buildings;

var nodes;
var bathrooms;

var grid;
var newGrid;

var mmap;
var mmesh;

var paths;
var pathFinder;

var scaleFactor = 3;

var w;
var h;

var makePoints;
var points;

var makePaths;

var bathroomJSON =[]
var addedPathsJSON = []

var allFloor1;
var womenFloor1;
var menFloor1

var buttons;

var agents;

var placingAgents;

var neutralA;
var femaleA;
var maleA;

var neutralC = "#CC7442"
var femaleC = "#335886"
var maleC = "#60B139"

var femaleLength = 0
var neutralLength = 0
var maleLength = 0

function preload(){
    buildingData = loadJSON('https://gist.githubusercontent.com/meitalhoffman/0bac477fa7eae34107870ab4d6e003b7/raw/ddc4e10a97cbe74d41d50a408837a0fbbfa4c32e/buildings.geojson')
    // rasterData = loadTable("https://gist.githubusercontent.com/meitalhoffman/72354205e2448376bff9a3787a78e5e3/raw/54e3335d99e903e5fabc4ebabbd44aeec6ec66f1/rasteredBuildings1",  "csv")
    rasterData = loadTable("https://gist.githubusercontent.com/meitalhoffman/435316def2115c3311c0ae9d79d6b960/raw/cc5a5fcb463d158616d95d6eb0f63dbcc4955ba1/rasterFirstFloorWithPaths", "csv")
    // bathroomData = loadTable("https://gist.githubusercontent.com/meitalhoffman/8dd81924d21cb0a737dd68a7b91baa34/raw/b0c23e0e30343c0ecfdf85a3cb24bc5f8c7f7888/bathrooms.csv", "csv")
    // firstFloorData = loadTable("https://gist.githubusercontent.com/meitalhoffman/2b5f3edd2daedaed86dca90efb40f7b3/raw/4800bc9ab8121cd943d9b5b6b029b2da1e8a0597/firstFloorBathroomRaster.csv", "csv")
//     allFloor1 = loadJSON('assets/bathrooms0-1.json')
//     womenFloor1 = loadJSON('assets/bathrooms0-2.json')
//     menFloor1 = loadJSON('assets/bathrooms0-3.json')
// }
}

function setup() { 
    w = 750
    h = 750
  createCanvas(1250, h);
  buildingFill = color(155);
  buildingStroke = color(255);
  bathrooms = [];
  nodes = [];
  paths = [];
  buttons = [];
  agents = []
//   mmap = new MercatorMap(w, h, -71.0879599370393009, -71.0944647124924103,  42.3577001454521209, 42.3625191577838578, 0)
  let boundingBox = getBB()
  minX = boundingBox[0]
  minY = boundingBox[1]
  maxX = boundingBox[2]
  maxY = boundingBox[3]
//   console.log(boundingBox)
//   parseBuildingData();
    parseRasterData();
    parseBathroomsData();
    makePoints = false;
    points = "bathrooms"
    makePaths = false;

    neutralA = false
    femaleA = false
    maleA = false
    makeButtons()
} 

function draw() { 
    // updateMouse()
    background(255);
    stroke(0)
    grid.draw()
    for(b in bathrooms){
        bathrooms[b].draw()
    }
    for(b in buttons){
        buttons[b].isOver = buttons[b].checkisOver()
        buttons[b].draw()
    }
    for(a in agents){
        agents[a].draw(mouseX, mouseY)
        agents[a].drawPath()
        // console.log("drawing agents")
    }
    drawInfo()
//   path.display()
}

function makeButtons(){
    let n = new button(780, 115, 70, 90, "#CC7442", 1, "Neutral")
    let f = new button(880, 115, 70, 90, "#335886", 2, "Female")
    let m = new button(980, 115, 70, 90, "#60B139", 3, "Male")
    let s = new button(780, 310, 100, 50, "#c2c4c6", 4, "Start")
    let r = new button(910, 310, 100, 50,  "#c2c4c6", 5, "Restart")
    buttons.push(n)
    buttons.push(f)
    buttons.push(m)
    buttons.push(s)
    buttons.push(r)
}

function makePointsOfInterest(){
    if(points == "bathrooms"){
        console.log("making bathroom")
        let newBath = {}
        newBath.x = mouseX
        newBath.y = mouseY
        newBath.l = 0
        newBath.type = 3
        bathroomJSON.push(newBath)
        bathrooms.push(new bathroom(mouseX, mouseY, 0, 2, 3))
    }
}
function makeNewPaths(){
    let closestX = round(mouseX/scaleFactor)
    let closestY = round(mouseY/scaleFactor)
    let newp = {}
    newp.x = closestX
    newp.y = closestY
    newp.walkable = 0
    addedPathsJSON.push(newp)
    grid.setWalkableAt(closestX, closestY, true)
}
function mouseClicked(){
    if(makePoints) makePointsOfInterest()
    if(makePaths) makeNewPaths()
    for(b in buttons){
        if(buttons[b].isOver){
            doAction(buttons[b].id)
            return
        }
    } for(a in agents){
        if(agents[a].placing && mouseX <= w && mouseY <= h) {
            agents[a].placeStart(mouseX, mouseY)
            if(agents[a].pref == 1 && neutralA == true) neutralA = false
            if(agents[a].pref == 2 && femaleA == true) femaleA = false
            if(agents[a].pref == 3 && maleA == true) maleA = false

        }
    }
}

function keyPressed(){
    if(keyCode == 83){
        if(points == "bathrooms" && makePoints) {
            saveJSON(bathroomJSON, 'bathrooms0-3.json')
            console.log("saved json")
        }else if(makePaths){
            saveJSON(addedPathsJSON, 'newpaths.json')
        }
    }
}

function updateMouse(){
    for(b in bathrooms){
        if(mouseX >= bathrooms[b].x - 2.5 && mouseX <= bathrooms[b].x + 2.5){
            if(mouseY >= bathrooms[b].y -2.5 && mouseX <= bathrooms[b].x + 2.5){
                // console.log(bathrooms[b].locString)
            }
        }
    }
}

function doAction(id){
    if(id < 4){
        createCharacter(id)
    } else if(id == 4) {
        for(a in agents){
            if(!agents[a].placing && !agents[a].pathFound){
                console.log("getting path for agent: " + String(agents[a].pref))
                let node = grid.getClosestNode(agents[a].x, agents[a].y)
                let targetB = findClosestBathroom(agents[a].x, agents[a].y, agents[a].pref)
                let newGrid = grid.clone()
                agents[a].path = pathFinder.findPath(newGrid.getNodeAt(node.x, node.y), 
                                newGrid.getNodeAt(targetB.x, targetB.y), newGrid)
                agents[a].pathFound = true
            }
        }
    } else if(id == 5){
        agents = []
    }
}

function createCharacter(id){
    if(id == 1 && !neutralA){
        neutralA = true
        let a = new agent(mouseX, mouseY, grid, id)
        agents.push(a)
    } else if(id == 2 && !femaleA){
        femaleA = true
        let f = new agent(mouseX, mouseY, grid, id)
        agents.push(f)
    } else if(id == 3 && !maleA){
        maleA = true
        let m = new agent(mouseX, mouseY, grid, id)
        agents.push(m)
    }
}

function findClosestBathroom(x, y, t){
    let minDist = Number.MAX_VALUE
    let bathx = 0
    let bathy = 0
    for(b in bathrooms){
        if(bathrooms[b].numType == t){
            let dist = sqrt(sq(x - bathrooms[b].x)+sq(y - bathrooms[b].y))
            if(dist < minDist) {
                minDist = dist
                bathx = bathrooms[b].x
                bathy = bathrooms[b].y
            }
        }
    }
    return grid.getNodeAt(round(bathx/scaleFactor), round(bathy/scaleFactor))
}
//section for loading/parsing data
function getBB() {
    return buildingData.bbox
}

function parseBathroomsData(){
    for(b in bathrooms01){
        let newBath = new bathroom(bathrooms01[b].x, bathrooms01[b].y, 0, 5, 1)
        bathrooms.push(newBath)
    } for(b in bathrooms02){
        let newBath = new bathroom(bathrooms02[b].x, bathrooms02[b].y, 0, 5, 2)
        bathrooms.push(newBath)
    } for(b in bathrooms03){
        let newBath = new bathroom(bathrooms03[b].x, bathrooms03[b].y, 0, 5, 3)
        bathrooms.push(newBath)
    }

}

function parseRasterData(){
    let graph = []
    for(let i = 0; i < w/scaleFactor; i++){
        var row1 = [];
        for(let j = 0; j < h/scaleFactor; j++){
            row1.push(1)
        }
        graph.push(row1)
    }
    let rows = rasterData.getRowCount()
    let cols = rasterData.getColumnCount()
    for(let i = 0; i < rows; i++){
        let row = rasterData.rows[i]
        let x = +row.get(0)
        let y = +row.get(1)
        let z = +row.get(2)
        let newLocation = getRasterLocation([x, y])
        if(z == 1){
            let graphX = round(newLocation[1])
            let graphY = round(newLocation[0])
            graph[graphX][graphY] = 0

        }
    }
    grid = new Grid(w/scaleFactor, h/scaleFactor, graph)
    pathFinder = new BiAStarFinder({
        allowDiagonal: true
    })
}

function parseBuildingData() {
    // console.log(buildings);
    let features = buildingData.features;
    for(let feature in features){
        let bld = features[feature]
        let vertices = bld['geometry']['coordinates'][0][0]
        // console.log(vertices)
        let name = bld['properties']['BLDG_NAME']
        let number = bld['properties']['FACILITY']
        buildings.push(new Building(vertices, name, number, buildingFill, buildingStroke))
    }

}

function drawInfo(){
    fill(0)
    stroke(0)
    textSize(30)
    text("Pit Stop:", 760, 30)
    text("An Interactive Bathroom Map of MIT", 760, 60)

    textSize(15)
    text("Select Your Character(s):", 760, 100)
    let text1 = "Drop your character on the map to see the closest place for them to pee"
    strokeWeight(.5)

    fill(0)
    text(text1, 760, 240, textWidth(text1)/2 + 40, 200)

    fill(255)
    text("Floor 1", 10, 25)

    fill(neutralC)
    text("Average Path Length to Gender Neutral Bathroom:" + String(neutralLength) + " ft", 760, 420)

    fill(femaleC)
    text("Average Path Length to Women's Bathroom:" + String(femaleLength) + " ft", 760, 450)

    fill(maleC)
    text("Average Path Length to Male Bathroom: " + String(maleLength) + " ft", 760, 480)

    fill(0)
    textSize(15)
    let text2= "Created by: Meital Hoffman"
    text(text2, 1250 - 20 - textWidth(text2), 730)
}

class button{
    constructor(_x, _y, _w, _h, _c, _id, _text){
        this.x = _x
        this.y = _y
        this.w = _w
        this.h = _h
        this.c = _c
        this.isOver = false
        this.id = _id
        this.text = _text
    }

    draw(){
        if(this.id >= 4){
            stroke(0)
            fill(this.c)
            rect(this.x, this.y, this.w, this.h)
            textSize(20)
            fill(0)
            text(this.text, this.x + this.w/2 - textWidth(this.text)/2, this.y + 25)
        }
        else {
        noStroke()
        fill(this.c)
        rect(this.x, this.y, this.w, this.h)
        textSize(15)
        text(this.text, this.x, this.y + this.h + 15)
        }
    }

    checkisOver(){
        if(mouseX >= this.x && mouseX <= this.x + this.w){
            if(mouseY >= this.y && mouseY <= this.y + this.h){
                return true
            }
        }
        return false
    }


}

function testPath(){
    var oldGrid = grid.clone()
    pathFinder = new BiAStarFinder({
        allowDiagonal: true
    })
    path = pathFinder.findPath(grid.getNodeAt(125, 125), grid.getNodeAt(130, 160), grid)
    newGrid = oldGrid
    // console.log(grid.isWalkableAt(130, 160))
}

//function that takes a PVector in the bounding box range and maps it to the current canvas
//returns a PVector corresponding to the correct location on the canvas
function getRasterLocation(array) {
    let x1 = array[0]
    let y1 = array[1]
    // console.log(x1)
    // console.log(y1)
    let result = []
    let x2 = map(x1, minX, maxX, 0, w/scaleFactor-1)
    let y2 = map(y1, minY, maxY, h/scaleFactor -1, 0)
    result.push(x2)
    result.push(y2)
    return result;
}

function getScreenYRelative(latitudeInDegrees) {
    return log(tan(latitudeInDegrees / 360 * PI + PI / 4));
}