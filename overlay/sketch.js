let socket;
let title = '';
let tasks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('taskList', receiveTask);
  socket.on('title', mostVotes);
}

function draw() {
  background(0, 255, 0);
  textSize(24);
  for (let i = 0; i < tasks.length; i++) {
    textAlign(LEFT);
    text(tasks[tasks.length - 1 - i], 10, 30 + i * 50);
  }
  textSize(36);
  textAlign(CENTER);
  text(title, width / 2, 50);
}

function receiveTask(data) {
  tasks = data;
}

function mostVotes(winner) {
  title = winner;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
