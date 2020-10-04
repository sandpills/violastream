let socket;
let taskArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  socket = io.connect();
  socket.on('task', receiveTask);
}

function draw() {
  background(220);
  textSize(24);
  for (let i = 0; i < taskArray.length; i++) {
    text(taskArray[i], 0, 30 + i * 30);
  }
}

function receiveTask({ task }) {
  console.log('receiving task... I MUST: ', task);
  taskArray.push(task);
  console.log(taskArray);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
