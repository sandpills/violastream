socket = io.connect();

function handleClick() {
  completeTask();
}

function completeTask() {
  var data = {
    task: 'endTask',
  };
  socket.emit('task', data);
}
