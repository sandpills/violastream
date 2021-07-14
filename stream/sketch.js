let socket = io.connect();
let from;
let to;
let xOff = 0.0;
let w = [];
let vid;
let textspeech;
let timerCountDown = 5; // VIOLA use this variable to make a p tag or something that shows above the buttons. This will show the timer value after a button is clicked
let countDown;
let buttonsActive = true;

function setup() {
  from = 175;
  to = 235;

  // the input
  input = createInput('tell me something');
  input.parent('messagebox');
  input.mousePressed(typing);
  input.position(0, 0);
  input.style('font-size', 14 + 'px');
  input.style('font-family', 'monaco');
  input.style('padding', '2px 10px');
  // the submit button
  button = createButton('submit');
  button.parent('messagebox');
  button.mousePressed(greet);
  button.position(input.x + input.width + 50, 0);
  button.style('font-size', 14 + 'px');
  button.style('background-color', 'rgba(0, 0, 0, 0.7)');
  button.style('color', '#ffffff');
  button.style('font-family', 'monaco');
  button.style('padding', '2px 10px');
  button.style('border-top', '1px solid #ffab20');
  button.style('border-right', '1px solid #ffab20');
  button.style('border-left', '1px solid #ffab20');
  button.style('border-bottom', '1px solid #ffab20');

  //***everything else can be commented out****//

  textAlign(CENTER);
  textSize(28);

  textspeech = new p5.Speech();
}

function draw() {
  clear();
  buttonsDelayTimer();
}

function typing() {
  input.value('');
}

function greet() {
  const sentiment = input.value();
  if (sentiment.length > 0) {
    socket.emit('greeting', sentiment);
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
    // this.opacity-=0.9;
    // console.log(this.x, this.y)
  }
}

function buttonsDelayTimer() {
  !buttonsActive
    ? document.getElementById('commands', 'camera').classList.add('buttons-inactive')
    : document.getElementById('commands', 'camera').classList.remove('buttons-inactive');
}

function buttonClick(e) {
  console.log(e.innerText); // any tag that's inside the HTML < > tag
  sendTask(e.innerText);
  buttonsActive = false;

  // delay timer
  countDown = setInterval(() => {
    timerCountDown--;
    console.log(timerCountDown);
    if (timerCountDown == 0) {
      timerCountDown = 5;
      clearInterval(countDown);
    }
  }, 1000);

  //remove class etc after 5sec
  setTimeout(() => {
    buttonsActive = true;
  }, 5000);
}

function sendTask(task) {
  var data = {
    task: task,
  };

  socket.emit('task', data);
}
