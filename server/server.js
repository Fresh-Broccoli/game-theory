const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

//To be extended when we want to deal with more than 2 players.
//var players = [];

io.on('connection', (sock) => {

  const _id = sock.id
  console.log('Socket Connected: ' + _id)

  if (waitingPlayer) {
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }
  
  sock.on('disconnect', () => {
    io.emit('myCustomEvent', {customEvent: 'Custom Message'})
    console.log('Socket disconnected: ' + _id)
  })

  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

//server.on()

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});