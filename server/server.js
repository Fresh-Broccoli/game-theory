const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const RpsGame = require('./rps-game');
const { Console } = require('console');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

var players = [];
var rooms = [];

//To be extended when we want to deal with more than 2 players.
//var players = [];

const findRoom = (room) => (a) => {
  return (a.room == room);
}

const notMe = (id) => (a) => {
  return (id != a);
}

const getID = (a, player) => {
  for (var i = 0; i < player.length; i++) {
    if (player[i].constID == a){
      return i;
    }
  }
}


io.on('connection', (sock) => {

  var room = 'Default';
  let opponent = sock;
  const _id = sock.id;

  sock.on('disconnect', () => {
    io.to(opponent.id).emit('disconnectEvent', _id);
    players.splice(players.indexOf(_id), 1);
  })

  //sock.on('message', (text) => {
    //io.to(sock.id).emit('message', text);
    //io.to(opponent.id).emit('message', text);
  //});

  sock.on('room', (text) => {
    room = text.split("/")[0];
    user = text.split("/")[1];

    var connection = {
      room: room,
      constID: sock.id,
      it: sock,
      name: user
    };
    players.push(connection);
    //console.log(players.forEach((a) => a.room))
    sock.leave(players[getID(_id, players)].room);
    sock.join(room)
    players[getID(_id, players)].room = room;

    if (players.filter(findRoom(room)).length % 2 === 0 && players.filter(findRoom(room)).length !== 0) {
      let index = players.filter(findRoom(room)).length;
      opponent = players.filter(findRoom(room))[index-2].it;
      opponent_name = players.filter(findRoom(room))[index-2].name;
      new RpsGame(opponent, sock, opponent_name, user);
    } else {
      io.to(_id).emit('message', 'Waiting for an opponent ' + user);
    }
  });

});

//server.on()

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('RPS started on 8080');
});