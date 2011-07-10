var net = require('net');

var OPENNI_PORT = 8888;

net.createServer(function(socket) {
  var buff = "";

  socket.on('data', function(data) {
    var msg = (buff + data.toString()).split('!');
    var len = msg.length;
    buff = msg[len - 1];
    for (var i = 0; i < len - 1; i++) {
      console.log(msg[i]);
      //socket.broadcast(msg[i]);
    }

    console.log(msg);
  });

  socket.on('error', function(err) {
    console.log(e);
  });
  
}).listen(OPENNI_PORT);

console.log('OpenNI server listening port %d', OPENNI_PORT);