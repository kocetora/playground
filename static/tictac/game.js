'use strict';

class TicTacToe {
  constructor(board) {
    this.nextURL = '';
    this.marker = '';
    this.userId = getUserId();
    this.board = board;
    this.history = [];
    this.winTarget = 5;
  }

  setEmitter(emitter) {
    this.emitter = emitter;

    emitter.on('move', data => {
      if (this.validate(data)) {
        this.board.draw(data);
        this.history.push(data);
        if (this.over(data)) {
          this.finishGame(data.marker);
        }
      }
    });

    emitter.once('setMarker', data => {
      const { from, marker } = data;
      const pos = x => 'x' ? 'x' : 'o';
      const neg = x => 'x' ? 'o' : 'x';
      this.marker = (from === this.userId ? pos : neg)(marker);
      console.log(this.marker);
    });

    emitter.once('goto', data => {
      this.nextURL = data.href;
    });

    this.board.listener = (x, y) => {
      console.log(`x:${x} y:${y}`);
      const move = { from: this.userId, x, y, marker: this.marker };
      if (this.validate(move)) {
        emitter.emit('move', move);
      }
    };
  }

  checkMarker() {
    if (!this.marker) {
      const random = Math.floor(Math.random()) % 2 ? 'x' : 'o';
      this.emitter.emit('setMarker', { from: this.userId, marker: random });
    }
  }

  validate(data) {
    const { history } = this;
    const { length } = this.history;
    const { from, x, y } = data;
    const { field } = this.board;
    return (
      (length === 0 || 
        history[length - 1].from !== from) 
      && !field[y][x]
  )}
  
  finishGame(marker) {
    const that = this;
    const finish = document.getElementById('finish');
    finish.style.display = 'block';
    const winner = document.getElementById('winner');
    const status = (this.marker === marker) ? 'won' : 'lost';
    winner.innerHTML = `You\'ve ${status}`;
    const nextGameBtn = document.getElementById('next-game-btn');
    nextGameBtn.addEventListener('click', async () => {
      
      if (that.nextURL) {
        window.location.href = that.nextURL;
      } else {
        const result = await fetch('../../create/tictac/');
        const data = await result.json();
        that.nextURL = `../../room/${data.token}/`;
        that.emitter.emit('goto', { href: that.nextURL });
        window.location.href = that.nextURL;
      }
    });
  }
  
  over(data) {
    const go = (matrix, coords, target, vector) => {
      const [x, y] = coords;
      const [dx, dy] = vector;
      if (matrix[y + dy] && matrix[y + dy][x + dx] === target) {
        return 1 + go(matrix, [x + dx, y + dy], target, vector);
      } else {
        return 0;
      }
    };
    const goVector = go.bind(
      null,
      this.board.field,
      [data.x, data.y],
      data.marker
    );
    const axis = [
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]],
      [[1, 0], [-1, 0]],
      [[0, 1], [-0, -1]]
    ];
    const results = axis.map(v => 1 + goVector(v[0]) + goVector(v[1]));
    const max = results.sort().pop();
    return max >= this.winTarget;
  }
}
