export function createGame() {
  const state = {
    players: {
    },
    fruits: {
    },
    screen: {
      width: 10,
      height: 10
    }
  }

  function setState(newState){
    Object.assign(state,newState)
  }

  const observers = []

  function start(){
    const frequency = 2000;

    setInterval(addFruit, frequency)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    console.log(`Notifying ${observers.length} observers!`);
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId;
    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId,
    })
  }


  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000);
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;
    delete state.fruits[fruitId]

    notifyAll({
      type: 'add-fruit',
      fruitId: fruitId,
    })
  }


  function movePlayer(command) {
    notifyAll(command)
     
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1
        }
      }
    }

    const keypress = command.keypress;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keypress];

    if (playerId && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId){
    const player =  state.players[playerId];

    for(const fruitId in state.fruits){
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruit}`);

      if(player.x === fruit.x && player.y === fruit.y){
        console.log(`Collision between ${playerId} and ${fruitId}`);

        removeFruit({fruitId});
      }
    }
  }

  return {
    setState,
    addPlayer,
    addFruit,
    removeFruit,
    removePlayer,
    movePlayer,
    state,
    subscribe,
    start
  }
}