
const blocksize = 30
let ypos = 0
let xpos = 0
let shape = []

//Raster erstellen
let fixedBackground = []
const width = 14
const height = 25
for(let i=0;i<height;i++){
  fixedBackground[i] = []
  for(let j=0; j< width; j++ ){
    fixedBackground[i][j] = 0
  }
}
let currentView = []
for(let i=0;i<height;i++){
  currentView[i] = []
  for(let j=0; j< width; j++ ){
    currentView[i][j] = 0
  }
}
let emptyRow = []
for(let j=0; j< width; j++ ){
  emptyRow[j] = 0
}

let emptyRow2 = []
for(let j=0; j< width; j++ ){
  emptyRow2[j] = 0
}


const colours = [[255, 190, 11], [251, 86, 7],[255, 0, 110],[131, 56, 236],[58, 134, 255]]
let colour
let score = 0


function setup() {

    cnv = createCanvas(width*blocksize, height*blocksize);
    centerCanvas();
    
  
  
  //createCanvas(200,600)
  //movingElem = {xpos: xArr[Math.floor(Math.random()*width)], ypos: 0,
  //  fillColor: 255, shape: randomShape() };

  addElem()
  console.log(currentView)
  
}

//fixedBackground[5][5] = [255,0,0]
let loopCounter = 0
let delay = 20 

function draw() {
  background(0);
  

  fill(255);
  
  
  if(blockInFirstRow() == false){
    drawView(fixedBackground)
    drawView(currentView)
    loopCounter += 1
    if (loopCounter >= delay){ 
      moveElemDown(currentView)
      loopCounter = 0
    }
    if(collision() == true){
      fixElem()
      addElem()
    }
  
    //Move element down with action key
    if(keyIsDown(DOWN_ARROW)){
      moveElemDown(currentView)
    }

    removeFilledRow()


  }else{
    gameOver()
  }

}


function gameOver(){
  
  
  fill(255)
  textSize(32);

  text('GAME OVER', width*blocksize/4, height*blocksize/2);
  textSize(20)
  text('Score: '+score, width*blocksize/4, height*blocksize/1.8)

}




function blockInFirstRow(){
  let blockInFirstRow = false
  for(let j=0; j<width;j++){
    if(fixedBackground[0][j]!=0){
      blockInFirstRow = true
    }
  }
  return blockInFirstRow
}


function removeFilledRow(){
  let filledRow = true
  for(let i= 0; i<height; i++){
  filledRow = true
  for(let j=0; j<width;j++){
    if(fixedBackground[i][j] == 0){
      filledRow = false
    }
  }
  if(filledRow == true){
    fixedBackground.splice(i,1)
    fixedBackground.unshift([...emptyRow])
    delay = delay-3
    score += 50
  }
  
}
  


}

function moveElemDown(currentView){
  if(ypos < height-1){
    let lastRow = currentView.pop()
    currentView.splice(0,0,[...emptyRow2])
    ypos += 1
  }
  
}

function drawView(View){
  for(let i=0; i<height;i++){
    for(let j=0; j<width;j++){
      if(View[i][j]!=0){
        block(j*blocksize,i*blocksize,View[i][j])
      }
    }
  }
}

function addElem(){
  xpos = Math.floor(Math.random() * (width-3));
  ypos = 0
  shape = randomShape()
  colour = randomColour()
  for(let i = 0;i<shape.length; i++){
    for(let j = 0; j< shape[0].length; j++){
      if(shape[i][j] == 1){
        currentView[ypos+i][xpos+j]=colour
      }
    }
  }
}

function randomColour(){
  let randomColour = colours[Math.floor(Math.random()*colours.length)]
  return randomColour
}

function collision(){
  let collision = false
  for(let i=0; i<height;i++){
    for(let j=0; j<width;j++){
      if(i == height-1 && currentView[i][j]!=0){
        collision = true
        break
      }
      if(currentView[i][j] != 0 && fixedBackground [i+1][j] != 0){
        collision = true
        break
      }
    }
  }
  return collision
}

function fixElem(){
  for(let i=0; i<height;i++){
    for(let j=0; j<width;j++){
      if(currentView[i][j]!=0){
        fixedBackground[i][j] = currentView[i][j]
        currentView[i][j] = 0
      }
    }
  }
}

function moveElemLeft(){
  for(let i=0; i<height;i++){
    currentView[i].shift()
    currentView[i].push(0)
    }
  xpos -= 1
  }


function moveElemRight(){
  for(let i=0; i<height;i++){
    currentView[i].pop()
    currentView[i].unshift(0)
    }
  xpos += 1
  }


function keyPressed() {
  let edgeCollision = false
  if (keyCode === LEFT_ARROW) {
    for(let i=0; i<height;i++){
      if(currentView[i][0]!=0){
        edgeCollision = true
        break
      }
      for(let j=0; j<width; j++){
        if(currentView[i][j] != 0 && fixedBackground[i][j-1] !=0){
          edgeCollision = true
          break
        }
      }
    }
    if(edgeCollision == false){
      moveElemLeft()
    }
     
  } else if (keyCode === RIGHT_ARROW) {
    for(let i=0; i<height;i++){
      if(currentView[i][width-1]!=0){
        edgeCollision = true
        break
      }
      for(let j=0; j<width; j++){
        if(currentView[i][j] != 0 && fixedBackground[i][j+1] !=0){
          edgeCollision = true
          break
        }
      }
    }
    if(edgeCollision == false){
      moveElemRight()
    }

  } else if (keyCode == UP_ARROW){
      rotateElem()
  }
}

function rotateElem(){
  
  if (collisionAtRotation() == false){
    shape = rotateShapeClockwise(shape);
    for(let i = 0;i<shape.length; i++){
      for(let j = 0; j< shape[0].length; j++){
        if(shape[i][j] == 1){
          currentView[ypos+i][xpos+j]=colour
        }
        else{
          currentView[ypos+i][xpos+j]=0
        }
      }
    }
  }
    
}

function collisionAtRotation(){
  let collision = false
  testShape = copyShape(shape)
  testShape = rotateShapeClockwise(testShape)
  for(let i = 0;i<testShape.length; i++){
    for(let j = 0; j< testShape[0].length; j++){
      if(testShape[i][j] == 1){
        if(fixedBackground[ypos+i][xpos+j] != 0){
          collision = true
        }
      if((ypos+i) > height-1 || (ypos+i)< 0 || (xpos+j) > width-1 || (xpos+j) <0){
        collision = true
      }
      }
    }
  }

  return collision
}

function block(x,y, colour){
  fill(colour)
  stroke('white')
  square(x,y,blocksize)
}



let LShape = [
          [0,0,1],
          [1,1,1],
          [0,0,0]];

let quadratShape = [[1,1],
                    [1,1]];

let straightShape = 
[[1,1,1,1], 
[0,0,0,0],
[0,0,0,0],
[0,0,0,0]
]

let TShape = [
  [1,1,1],
  [0,1,0],
  [0,0,0]
]

let skewShape = [
  [0,1,1],
  [1,1,0],
  [0,0,0]
]


function randomShape(){
  let shapes = [LShape, quadratShape, straightShape, TShape, skewShape];  //!!
  let shape = shapes[Math.floor(Math.random()*shapes.length)]
  let randomShape = copyShape(shape);
  return randomShape;
}


function rotateShapeClockwise(a) {
        var n=a.length;
        for (var i=0; i<n/2; i++) {
            for (var j=i; j<n-i-1; j++) {
                var tmp=a[i][j];
                a[i][j]=a[n-j-1][i];
                a[n-j-1][i]=a[n-i-1][n-j-1];
                a[n-i-1][n-j-1]=a[j][n-i-1];
                a[j][n-i-1]=tmp;
            }
        }
        return a;
    }

function copyShape(shape){
  let newShape = [];

  for (var i = 0; i < shape.length; i++)
      newShape[i] = shape[i].slice();

  return newShape;
}

var cnv;

function centerCanvas() {
  var x = (windowWidth - (width*blocksize)) / 2;
  var y = (windowHeight - (height*blocksize)) / 2;
  cnv.position(x, y);
}



function windowResized() {
  centerCanvas();
}

function refreshPage(){
  window.location.reload();
}