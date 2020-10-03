var express = require('express');
var app = express();
var http = require('http').createServer(app);

app.use('/', express.static('public'));
app.use('/overlay', express.static('overlay'));

http.listen(3000, () => {
  console.log('listening on *:3000');
});
