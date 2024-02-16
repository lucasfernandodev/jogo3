
export function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {

  screen.width = game.state.screen.width;
  screen.height = game.state.screen.height;

  console.log("width", game.state.screen.width)

  const context = screen.getContext('2d');
  context.fillStyle = "white";
  context.clearRect(0, 0, screen.width, screen.height);


  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = 'black';
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = 'green';
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currenPlayer = game.state.players[currentPlayerId];

  if(currenPlayer){
    context.fillStyle = '#F0DB4F';
    context.fillRect(currenPlayer.x, currenPlayer.y,1,1)
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })
}