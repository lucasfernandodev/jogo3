import express from 'express';
import http from 'node:http';
import {createGame} from './public/game/index.js'
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app)
const socket = new Server(server);

app.use(express.static('public'));




const game = createGame()

game.subscribe((command) => {
  console.log(`> Emitting  ${command.type}`);
  socket.emit(command.type, command);
})

game.start()

socket.on("connection", (socket) => {
  const playerId = socket.id;
  console.log("> PLayer Connected: ", playerId)

  game.addPlayer({playerId})

  socket.emit('setup', game.state)

  socket.on("disconnect", () => {
    game.removePlayer({playerId})
    console.log('> Player disconnected: ', playerId)
  });

  socket.on('move-player', (command) => {
    command.playerId = playerId;
    command.type = 'move-player';
    game.movePlayer(command)
  })
})



server.listen(3000, () => {
  console.log('> Server listening on port: 3000');
})