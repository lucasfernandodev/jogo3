import { createKeyboardListener } from "../game/KeyboardListener.js";
import { createGame } from "../game/index.js";
import { renderScreen } from "../game/render-screen.js";
const socket = io();


const game = createGame()
const keyboardListener = createKeyboardListener(document)
const notifyNetworkingWithPlayerMove = (command) => {
  socket.emit("move-player", command)
}

socket.on('connect', () => {
  const playerId = socket.id;
  console.log(`Player connected with id: `, playerId);

  const screen = document.querySelector("#screen");
  renderScreen(screen, game, requestAnimationFrame, playerId)
})

socket.on('setup', (state) => {
  const playerId = socket.id;
  game.setState(state);
  keyboardListener.registrePlayerId(playerId)
  keyboardListener.subscribe(game.movePlayer)
  keyboardListener.subscribe(notifyNetworkingWithPlayerMove)
})



socket.on('disconnect', () => {
  keyboardListener.unsubscribe(game.movePlayer)
  keyboardListener.unsubscribe(notifyNetworkingWithPlayerMove)
})


socket.on('add-player', (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  game.addPlayer(command)
})

socket.on('remove-player', (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  game.removePlayer(command)
})

socket.on('move-player', (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  const playerId = socket.id;

  if (playerId !== command.playerId) {
    game.movePlayer(command)
  }
})

socket.on('add-fruit', (command) => {
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);
  game.addFruit(command)
})


socket.on('remove-fruit', (command) => {
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);
  game.removeFruit(command)
})

socket.on('change-screen', (command) => {
  console.log(`Resizing screen for ${command.width}x${command.height}`);
  game.changeScreenSize(command)
})





