let counter = 0;
var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const options = {
  /* ... */
};
let taskArray = [];
let voteCounts = {};
let votesSorted = {};
let stopTaskVotes = 0;
const io = require('socket.io')(http, options);
io.on('connection', socket => {
  console.log(socket.id);

  // any code here will run when a user connects
});

// routes
app.use('/', express.static('public'));
app.use('/stream', express.static('stream'));
app.use('/overlay', express.static('overlay'));
app.use('/done', express.static('done'));

http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});

io.sockets.on('connection', socket => {
  socket.on('task', data => {
    // socket listening to "task" coming in from HTML page
    if (data.task !== 'endTask') {
      if (data.task === 'left') { //THIS WHOLE SECTION IS TRYING TO DO THE CAMERA THING!!!
        socket.broadcast.emit('cameraLeftButton');
      } else if (data.task === 'right') {
        socket.broadcast.emit('cameraRightButton');
      } else if (data.task === 'up') { 
        socket.broadcast.emit('cameraUpButton');
      } else if (data.task === 'down') { 
        socket.broadcast.emit('cameraDownButton');
      } 
      // task messages
      else if (data.task === 'STOP TASK') {
        socket.broadcast.emit('greetingFromUser', 'STOP TASK');
        stopTaskVotes++;
        let winner =
          votesSorted[
            Object.keys(votesSorted)[Object.keys(votesSorted).length - 1]
          ];
        let count = voteCounts[winner];
        if (stopTaskVotes > count || stopTaskVotes > 4) {
          endTask(socket);
          stopTaskVotes = 0;
        }
      } else {
        taskArray.push(data.task);

        voteCounts = _.countBy(taskArray); // coming from 'lodash' array sorting package function

        votesSorted = Object.keys(voteCounts).sort(function (a, b) {
          return voteCounts[a] - voteCounts[b];
        });
        socket.broadcast.emit('taskList', taskArray); //send stuff out to clients
      }
    } else {
      endTask(socket);
    }
  });
  socket.on('greeting', greeting => {
    socket.broadcast.emit('greetingFromUser', greeting);
  });
});

function endTask(socket) {
  // 'end task' coming fomr 'done' page, sorting votes
  let winner =
    votesSorted[Object.keys(votesSorted)[Object.keys(votesSorted).length - 1]];
  let count = voteCounts[winner];
  socket.broadcast.emit('taskList', winner, count);
  taskArray = [];
}