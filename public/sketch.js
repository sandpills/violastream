/**** THIS P5 SKETCH IS FOR THE TEXT FLY THING. EVENTUALLY IT SHOULD BE COMBINED INTO THE OVERLAY P5 */
/** IT'S INCLUDED HERE BECAUSE I MADE THE TEXT INPUT BUTTONS ALSO IN P5 */

let from;
let to;
let xOff = 0.0;
let w = [];
let vid;
let textspeech;

function setup() {
  from = 175;
  to = 235;

  // the input
  input = createInput('tell me something');
  input.parent("messagebox");
  input.mousePressed(typing);
  input.position(0, 0);
  // the submit button
  button = createButton('submit');
  button.parent("messagebox");
  button.mousePressed(greet);
  button.position(input.x + input.width+5, 0);
 

//***everything else can be commented out****//

  var canvas = createCanvas(600,400);
  canvas.parent("content");
  canvas.position(0,0);
  textAlign(CENTER);
  textSize(28);
  
  textspeech = new p5.Speech();
}

function draw() {
  clear();
  for (let i = 0; i < w.length; i++){
    w[i].moveAndDisplay();
    if (w[i].x <= -width){
      //w.splice(i, 1);
      w[i].x = null;
      w[i].y = null;
    }
  }
}

function typing() {
    input.value('');
}

function greet() {
  const sentiment = input.value();
  if (sentiment.length > 0){
    let typedword = new Word(sentiment, width, random(10, height-10));
    w.push(typedword);
    textspeech.speak(typedword.word); 
    console.log(typedword);
    input.value('');
  }
}

class Word{
  constructor(word, x, y){
    this.word = word;
    this.opacity = 255;
    this.x = x;
    this.y = y;
  }

  moveAndDisplay(){
    fill(255, this.opacity);
    textAlign(LEFT);
    text(this.word, this.x+20, this.y-20)
    textAlign(CENTER)
    this.x-=3;
    // this.opacity-=0.9;
    // console.log(this.x, this.y)
  }
}