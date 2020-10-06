socket = io.connect();

function buttonClick(e) {
  console.log(e.innerText);
  sendTask(e.innerText);
}

function sendTask(task) {
  var data = {
    task: task,
  };
  socket.emit('task', data);
}
