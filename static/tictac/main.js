'use strict';
async function main() {
  const json = await fetch('./json');
  const data = await json.json();
  const socket = new WebSocket(`ws://127.0.0.1:8000/${data.token}`);
  let sizeSet = false;
  socket.onopen = () => {
    const ee = new SocketEventEmitter(socket);
    ee.once('setSize', data => {
      sizeSet = true;
      const size = parseInt(data.size);
      const board = new TicTacToeBoard('mycanvas', size);
      board.initialize();
      const game = new TicTacToe(board);
      game.setEmitter(ee);
      const chat = new Chat('chat', 'msg');
      chat.setEmitter(ee);
      console.log(data.history);
      game.checkMarker();
    });
    ee.load(data.history);
    if (!sizeSet) {
      const size = prompt('Choose size');
      ee.emit('setSize', { size });
    }
  };
}
main();
