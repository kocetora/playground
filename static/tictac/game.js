'use strict';
class TicTacToe {
  constructor(board) {
    this.nextURL = '';
    this.marker = '';
    this.userId = getUserId();
    this.board = board;
    this.history = [];
  }
  setEmitter(emitter) {
    this.emitter = emitter;
    const that = this;
    emitter.on('move', data => {
      if (that.validate(data)) {
        that.board.draw(data);
        that.history.push(data);
        if (that.over(data)) {
          that.finishGame(data.marker);
        }
      }
    });
    emitter.once('setMarker', data => {
      if (data.from === that.userId) {
        that.marker = data.marker === 'x' ? 'x' : 'o';
      } else {
        that.marker = data.marker === 'x' ? 'o' : 'x';
      }
      console.log(that.marker);
    });
    emitter.once('goto', data => {
      that.nextURL = data.href;
    });
    this.board.listener = (x, y) => {
      console.log(`x:${x} y:${y}`);
      const move = { from: that.userId, x, y, marker: that.marker };
      if (that.validate(move)) {
        emitter.emit('move', move);
      }
    };
  }
  checkMarker() {
    const that = this;
    if (!this.marker) {
      const random = Math.floor(Math.random() * 2) ? 'x' : 'o';
      that.emitter.emit('setMarker', { from: this.userId, marker: random });
    }
  }
  validate(data) {
    const that = this;
    if (
      (that.history.length === 0 ||
        that.history[that.history.length - 1].from !== data.from) &&
      !that.board.field[data.y][data.x]
    )
      return true;
  }
  finishGame(marker) {
    const that = this;
    const finish = document.getElementById('finish');
    finish.style.display = 'block';
    const winner = document.getElementById('winner');
    if (this.marker === marker) {
      winner.innerHTML = 'You\'ve won';
    } else {
      winner.innerHTML = 'You\'ve lost';
    }
    const nextGameBtn = document.getElementById('next-game-btn');
    nextGameBtn.addEventListener('click', async () => {
      if (that.nextURL) {
        window.location.href = that.nextURL;
      } else {
        const json = await fetch('../../create/tictac/');
        const data = await json.json();
        that.nextURL = `../../room/${data.token}/`;
        that.emitter.emit('goto', { href: that.nextURL });
        window.location.href = that.nextURL;
      }
    });
  }
  over(data) {
    const that = this;
    // up to down
    let count = 0;
    let x1, x2, y1, y2;
    const x = data.x;
    const y = data.y;
    y <= 4 ? (y1 = 0) : (y1 = y - 5);
    y >= that.board.size - 1 - 5 ? (y2 = that.board.size - 1) : (y2 = y + 5);
    for (let j = y1; j <= y2; j++) {
      if (that.board.field[j][x] === data.marker) {
        count++;
      } else {
        count = 0;
      }
      if ((count === 5 && that.board.size > 4) || count === that.board.size) {
        return true;
      }
    }
    //left to right
    count = 0;
    x <= 4 ? (x1 = 0) : (x1 = x - 5);
    x >= that.board.size - 1 - 5 ? (x2 = that.board.size - 1) : (x2 = x + 5);
    for (let i = x1; i <= x2; i++) {
      if (that.board.field[y][i] === data.marker) {
        count++;
      } else {
        count = 0;
      }
      if ((count === 5 && that.board.size > 4) || count === that.board.size) {
        return true;
      }
    }
    // upleft to downright
    count = 0;
    x <= 4 ? (x1 = 0) : (x1 = x - 5);
    x >= that.board.size - 1 - 5 ? (x2 = that.board.size - 1) : (x2 = x + 5);
    y <= 4 ? (y1 = 0) : (y1 = y - 5);
    y >= that.board.size - 1 - 5 ? (y2 = that.board.size - 1) : (y2 = y + 5);
    for (let i = x1, j = y1; i <= x2, j <= y2; i++, j++) {
      if (that.board.field[j][i] === data.marker) {
        count++;
      } else {
        count = 0;
      }
      if ((count === 5 && that.board.size > 4) || count === that.board.size) {
        return true;
      }
    }
    //downleft to upright
    count = 0;
    x <= 4 ? (x1 = 0) : (x1 = x - 5);
    x >= that.board.size - 1 - 5 ? (x2 = that.board.size - 1) : (x2 = x + 5);
    y >= that.board.size - 1 - 5 ? (y1 = that.board.size - 1) : (y1 = y + 5);
    y <= 4 ? (y2 = 0) : (y2 = y - 5);
    for (let i = x1, j = y1; i <= x2, j >= y2; i++, j--) {
      if (that.board.field[j][i] === data.marker) {
        count++;
      } else {
        count = 0;
      }
      if ((count === 5 && that.board.size > 4) || count === that.board.size) {
        return true;
      }
    }
    return false;
  }
}
