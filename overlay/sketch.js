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
  socket.on('chatMessage', chatFromUser);

  textspeech = new p5.Speech();
}

function mousePressed() {
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
  }
  textSize(32);
  textAlign(CENTER);

  if (title !== '') {
    rectMode(CENTER);
    rect(width / 2, 40, 850, 50);

    text(title, width / 2, 50);
  }

  // text flying thingy
  textSize(28);
  for (let i = 0; i < w.length; i++) {
    w[i].moveAndDisplay();
    if (w[i].x <= -width) {
      //w.splice(i, 1);
      w[i].x = null;
      w[i].y = null;
    }
  }
}

// text flying thingy

function greet() {
  const sentiment = input.value();
  if (sentiment.length > 0) {
    let typedword = new Word(sentiment, width, random(10, height - 10));
    w.push(typedword);
    textspeech.speak(typedword.word);
    console.log(typedword);
    input.value('');
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
    fill(255, this.opacity);
    textAlign(LEFT);
    text(this.word, this.x + 20, this.y - 20);
    textAlign(CENTER);
    this.x -= 3;
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
      // winnerCount = count;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
