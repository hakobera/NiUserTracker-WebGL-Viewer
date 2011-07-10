/**
 * Module dependencies.
 */
var net = require('net')
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , sio = require('socket.io');

/**
 * @constant
 */
var OPENNI_PORT = 8888;

/**
 * App.
 */
var app = express.createServer();

/**
 * App configuration.
 */
app.configure(function() {
  app.use(stylus.middleware({ src: __dirname + '/puublic', compile: compile }));
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname);
  app.set('view engine', 'ejs');

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  }
});

/**
 * App routes.
 */
app.get('/', function(req, res) {
  res.render('index', { layout: false });
});

/**
 * App listen.
 */
app.listen(3000, function() {
   var addr = app.address();
  console.log('app listening on http://%s:%d', addr.address, addr.port);
});

/**
 * Socket.IO server.
 */
var io = sio.listen(app);
io.sockets.on('connection', function(socket) {
  console.log(socket);
});

/**
 * OpenNI UserTracker Web bridge.
 */
net.createServer(function(socket) {
  var buff = "";

  socket.on('data', function(data) {
    var msg = (buff + data.toString()).split('!');
    var len = msg.length - 1;
    buff = msg[len];
    for (var i = 0; i < len; i++) {
      //console.log(msg[i]);
      io.sockets.emit('message', msg[i]);
    }

    console.log(msg);
  });

  socket.on('error', function(err) {
    console.log(e);
  });
  
}).listen(OPENNI_PORT);

console.log('OpenNI server listening port %d', OPENNI_PORT);