'use strict';
class TicTacToeBoard {
  constructor(id, size = 3, k = 1) {
    this.listener = null;
    this.k = k;
    this.size = size;
    this.field = [];
    for (let i = 0; i < size; i++) {
      // TODO: fill empty array
      this.field.push(new Array().fill(''));
    }
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
  }

  initialize(width = window.innerWidth, height = window.innerHeight) {
    // TODO: const { width, height } = this;
    this.width = width;
    this.height = height;
    // TODO: use if
    this.width >= this.height ?
      (this.width = this.height) :
      (this.height = this.width);
    this.ctx.canvas.width = this.width * this.k;
    this.ctx.canvas.height = this.height * this.k;
    this.drawField();
    // TODO: do not use that here
    const that = this;
    this.canvas.addEventListener('click', e => {
      let x,
          y = -1;
      for (let i = -1; i < that.size; i++) {
        // TODO: functional decompose
        if (
          e.pageX > (that.width * (i + 1)) / (that.size + 2) &&
          e.pageX < (that.width * (i + 3)) / (that.size + 2)
        )
          x = i;
        if (
          e.pageY > (that.height * (i + 1)) / (that.size + 2) &&
          e.pageY < (that.height * (i + 3)) / (that.size + 2)
        )
          y = i;
      }
      if (x + y) {
        console.log('x: ' + x + '; y: ' + y);
        that.listener(x, y);
      }
    });
  }
  drawField() {
    for (let i = 2; i <= this.size; i++) {
      this.ctx.beginPath();
      // TODO: use variables for free
      this.ctx.moveTo(
        (this.width * this.k * i) / (this.size + 2),
        (this.height * this.k * 1) / (this.size + 2)
      );
      this.ctx.lineTo(
        (this.width * this.k * i) / (this.size + 2),
        (this.height * this.k * (this.size + 1)) / (this.size + 2)
      );
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.stroke();
      this.ctx.closePath();
    }
    for (let i = 2; i <= this.size; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        (this.width * this.k * 1) / (this.size + 2),
        (this.height * this.k * i) / (this.size + 2)
      );
      this.ctx.lineTo(
        (this.width * this.k * (this.size + 1)) / (this.size + 2),
        (this.height * this.k * i) / (this.size + 2)
      );
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  draw({ x, y, marker }) {
    this.drawCircle(x, y);
    this.field[y][x] = marker;
  }

  drawCircle(x, y) {
    this.ctx.beginPath();
    // TODO: use variables
    this.ctx.arc(
      (this.width * this.k * 1.5) / (this.size + 2) +
        (this.width * this.k * x) / (this.size + 2),
      (this.height * this.k * 1.5) / (this.size + 2) +
        (this.width * this.k * y) / (this.size + 2),
      (this.width * this.k * 0.45) / (this.size + 2),
      0,
      2 * Math.PI
    );
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#00BFFF';
    this.ctx.stroke();
    this.ctx.closePath();
  }
  drawCross(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(
      (this.width * this.k * (x + 1)) / (this.size + 2),
      (this.height * this.k * (y + 1)) / (this.size + 2)
    );
    this.ctx.lineTo(
      (this.width * this.k * (x + 2)) / (this.size + 2),
      (this.height * this.k * (y + 2)) / (this.size + 2)
    );
    this.ctx.moveTo(
      (this.width * this.k * (x + 1)) / (this.size + 2),
      (this.height * this.k * (y + 2)) / (this.size + 2)
    );
    this.ctx.lineTo(
      (this.width * this.k * (x + 2)) / (this.size + 2),
      (this.height * this.k * (y + 1)) / (this.size + 2)
    );
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#ff1493';
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
