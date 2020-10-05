let counter = 0;
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const options = {
  /* ... */
};
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
    socket.broadcast.emit('task', data);
    console.log(data);
    counter++;
    console.log(counter);
  });
});
