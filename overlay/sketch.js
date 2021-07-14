let socket;
let title = '';
let tasks = [];
let w = [];
let textspeech;
let speaking = false;
// let winnerCount;

let serial;
let portName = '/dev/tty.usbmodem144201';
let outByte = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('taskList', receiveTask);
  socket.on('greetingFromUser', displayMessageFromUser);
  socket.on('cameraLeftButton', cameraLeft);
  socket.on('cameraRightButton', cameraRight);
  socket.on('cameraUpButton', cameraUp);
  socket.on('cameraDownButton', cameraDown);

  textspeech = new p5.Speech();

  //serial
  serial = new p5.SerialPort(); 
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError); 
  serial.on('close', portClose); 
 
  serial.list(); 
  serial.open(portName);
}

function portOpen() {
  console.log('the serial port opened.')
}
 
function serialEvent() {
  console.log('serial event')
  let inByte = serial.read();
  inData = inByte; //store in global variable
}
 
function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  console.log('The serial port closed.');
}


function mousePressed() {
  textspeech.speak('hello viola'); // initialize
}

function draw() {
  textFont('monaco');
  background(0, 255, 0);
  textSize(20);
  textStyle(BOLD);
  noStroke();
  fill(0, 0, 0, 100);
  // rectMode(CORNER);
  // rect(0, 0, 260, 40 * tasks.length);
  for (let i = 0; i < tasks.length; i++) {
    fill(255);
    textAlign(LEFT);
    text(tasks[tasks.length - 1 - i], windowWidth - windowWidth/5, 200 + i * 40);
  }
  textSize(25);
  textAlign(CENTER);

  if (title !== '') {
    rectMode(CENTER);
    fill(0);
    rect(width / 2, 70, 680, 50);
    fill(255);
    text(title, width / 2, 80);
  }

  // text flying thingy
  push();
  for (let j = 0; j < w.length; j++) {
    w[j].moveAndDisplay();
    if (w[j].x <= -width) {
      w[j].x = null;
      w[j].y = null;
    }
  }
  pop();

  // green rectangle to block off lower half
  rectMode(CORNER);
  fill(0, 255, 0);
  rect(0, windowHeight - windowHeight/3, windowWidth, windowHeight/2);

}

// text flying thingy

function displayMessageFromUser(greeting) {
  console.log(greeting);
  if (greeting.length > 0) {
    let typedword = new Word(greeting, width, random(10, height - 10));
    w.push(typedword);
    textspeech.speak(typedword.word);
  }
}

class Word {
  constructor(word, x, y) {
    this.word = word;
    this.opacity = 255;
    this.x = x;
    this.y = y;
  }

  moveAndDisplay() {
    let tWidth = textWidth(this.word);
    fill(255);
    textAlign(CENTER);
    rectMode(CENTER);
    rect(this.x+20, this.y-30, tWidth+20, 40);
    fill(0, this.opacity);
    text(this.word, this.x+20, this.y-20);
    this.x-=3;
  }
}

// socket stuffs

function receiveTask(data, count) {
  if (Array.isArray(data)) {
    tasks = data;
    textspeech.speak(data[data.length - 1]);
  } else {
    // if it's not an array, that means we're getting the winner message
    if (typeof data === 'string') {
      tasks = [];
      title = 'viola must: ' + data + ' (' + str(count) + ' votes)';
      textspeech.speak(title);
      // winnerCount = count;
    }
  }
}

function cameraLeft() {
  console.log("left");
  serial.write("L");
  textspeech.speak("camera left");
}

function cameraRight() {
  console.log("right");
  serial.write("R");
  textspeech.speak("camera right");
}

function cameraUp() {
  console.log("up");
  serial.write("U");
  textspeech.speak("camera up");
}

function cameraDown() {
  console.log("down");
  serial.write("D");
  textspeech.speak("camera down");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}