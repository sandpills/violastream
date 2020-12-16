let socket;
let title = '';
let tasks = [];
let textspeech;
let speaking = false;
// let winnerCount;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('taskList', receiveTask);

  textspeech = new p5.Speech();
}

function mousePressed(){
  textspeech.speak('hello viola'); // initialize
}

function draw() {
  textFont('monospace');
  background(0, 255, 0);
  textSize(20);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, 260, 40 * tasks.length);
  for (let i = 0; i < tasks.length; i++) {
    textAlign(LEFT);
    text(tasks[tasks.length - 1 - i], 10, 25 + i * 40);
    speaking = true;
      if ( speaking === true ) {
        textspeech.speak(data); 
        console.log (data);
        speaking = false;
      }
  }
  textSize(32);
  textAlign(CENTER);
  
  if (title !== '') {
    rectMode(CENTER);
    rect(width / 2, 40, 850, 50);

    text(title, width / 2, 50);
  }
}

function receiveTask(data, count) {
  if (Array.isArray(data)) {
    tasks = data;
  } else {  // if it's not an array, that means we're getting the winner message
    if (typeof data === 'string') {
      tasks = [];
      title = 'viola must: ' + data + ' (' + str(count) + ' votes)';
      // winnerCount = count;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
