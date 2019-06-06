'use strict';

async function main() {
  const result = await fetch('./json');
  const data = await result.json();
  const socket = new WebSocket(`ws://${config.domain}/${data.token}`);

  socket.onopen = () => {
    const ee = new SocketEventEmitter(socket);
    ee.once('setSize', data => {
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
    if (ee.listeners('setSize').size) {
      const size = prompt('Choose size');
      ee.emit('setSize', { size });
    }
  };
}

main();
