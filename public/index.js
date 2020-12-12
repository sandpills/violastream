socket = io.connect();

function buttonClick(e) {
  console.log(e.innerText); // any tag that's inside the HTML < > tag
  sendTask(e.innerText);
}

function sendTask(task) {
  var data = {
    task: task,
  };

  socket.emit('task', data);
}
