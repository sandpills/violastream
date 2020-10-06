let socket;
let title = '';
let tasks = [];
let winnerCount;

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('taskList', receiveTask);
}

function draw() {
  textFont('monospace');
  background(0, 255, 0);
  textSize(24);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, 270, 50 * tasks.length);
  for (let i = 0; i < tasks.length; i++) {
    textAlign(LEFT);
    text(tasks[tasks.length - 1 - i], 10, 30 + i * 50);
  }
  textSize(36);
  textAlign(CENTER);
  if (title !== '') {
    rectMode(CENTER);
    rect(width / 2, 40, 900, 50);

    text(title, width / 2, 50);
  }
}

function receiveTask(data, count) {
  if (Array.isArray(data)) {
    tasks = data;
  } else {
    if (typeof data === 'string') {
      tasks = [];
      title = 'viola must: ' + data + ' (' + str(count) + ' votes)';
      winnerCount = count;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
