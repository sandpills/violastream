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
    if (data.task !== 'endTask') {
      taskArray.push(data.task);
      voteCounts = _.countBy(taskArray);

      votesSorted = Object.keys(voteCounts).sort(function (a, b) {
        return voteCounts[a] - voteCounts[b];
      });
      socket.broadcast.emit('taskList', taskArray);
    } else {
      let winner =
        votesSorted[
          Object.keys(votesSorted)[Object.keys(votesSorted).length - 1]
        ];
      let count = voteCounts[winner];
      socket.broadcast.emit('taskList', winner, count);
      taskArray = [];
    }
  });
});
