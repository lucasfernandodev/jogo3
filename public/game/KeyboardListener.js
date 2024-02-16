export function createKeyboardListener(document) {
  const state = {
    observers: [],
    playerId: null
  }

  function registrePlayerId(playerId){
    state.playerId = playerId
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction)
  }

  function unsubscribe(observerFunction){
    state.observers = state.observers.filter(obs => obs !== observerFunction);
  }

  function notifyAll(command) {
    console.log(`Notifying ${state.observers.length} observers!`);
    for (const observerFunction of state.observers) {
      observerFunction(command)
    }
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    const keypress = event.key;

    const command = {
      type: 'move-player',
      playerId: state.playerId,
      keypress
    }

    notifyAll(command)
  }

  return {
    subscribe,
    registrePlayerId,
    unsubscribe
  }
}