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

const io = require('socket.io')(http, options);
io.on('connection', socket => {
  console.log(socket.id);
});

// routes
app.use('/', express.static('public'));
app.use('/overlay', express.static('overlay'));
app.use('/done', express.static('done'));

http.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log('listening on *:3000');
});

io.sockets.on('connection', socket => {
  socket.on('task', data => {
    taskArray.push(data.task);
    voteCounts = _.countBy(taskArray);

    let votesSorted = Object.keys(voteCounts).sort(function (a, b) {
      return voteCounts[a] - voteCounts[b];
    });

    if (data.task == 'endTask') {
      socket.broadcast.emit('mostVotes', taskArray);
    } else {
      console.log(taskArray);
      socket.broadcast.emit('taskList', taskArray);
    }
  });
});
