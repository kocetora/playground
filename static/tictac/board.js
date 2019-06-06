'use strict';
class TicTacToeBoard {
  constructor(id, size = 3, k = 1) {
    this.listener = null;
    this.k = k;
    this.size = size;
    this.field = [];
    this.frame = this.size + 2;
    const { w = innerWidth, h = innerHeight } = window;
    this.width = this.height = (( w > h ) ? h : w);
    for (let i = 0; i < size; i++) {
      this.field.push(new Array(this.size).fill(''));
    }
    this.wkf = this.width * this.k / this.frame;
    this.hkf = this.height * this.k / this.frame;
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
  }

  initialize() {
    const { width, height, k, size, frame, ctx, canvas } = this;
    ctx.canvas.width = width * k;
    ctx.canvas.height = height * k;
    this.drawField();
    canvas.addEventListener('click', e => { 
      let x, y = -1;
      for (let i = -1; i < size; i++) {
        for (let j = 1; j <= 2; j++){
          let cord = 'page' + (j % 2 ? 'X' : 'Y'); 
          let l = ( j % 2 ? width : height ) / frame;
            if (e[cord] > l * (i + 1) && e[cord] < l * (i + 3)) {
              (j % 2 ? x = i : y = i); 
            }
          }
        }
      if (x >= 0 && y >= 0) { 
        console.log('x: ' + x + '; y: ' + y);
        this.listener(x, y);
      }
    });
  }
  
  drawField() {
    const { wkf, hkf, size, ctx} = this;
    const axis = [[0, 1], [1, 0]];
    const draw = (line) => {
      for ( let i = 2; i <= size; i++) {
      ctx.beginPath(); 
      ctx.moveTo( 
        wkf * (line[0]===0?i:1) , 
        hkf * (line[1]===0?i:1)); 
      ctx.lineTo(
        wkf * (line[0]===0?i:(size + 1)),   
        hkf * (line[1]===0?i:(size + 1))); 
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.closePath();
    }
      }
    axis.map(v => draw(v));
    }

  draw({ x, y, marker }) {
    if (marker === 'o') {
      this.drawCircle(x, y);
      this.field[y][x] = 'o';
    } else {
      this.drawCross(x, y);
      this.field[y][x] = 'x';
    }
  }

  drawCircle(x, y) {
    const { wkf, hkf, ctx } = this;
    const xarc = wkf * 1.5 + wkf * x;
    const yarc = hkf * 1.5 + wkf * y;
    const r = wkf * 0.45;
    ctx.beginPath();
    ctx.arc( xarc, yarc, r, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00BFFF';
    ctx.stroke();
    ctx.closePath();
  }
  
  drawCross(x, y) {
    const { wkf, hkf, ctx } = this;
    const axis = [[1, 1], [2, 2], [1, 2], [2, 1]];
    ctx.beginPath();
    const draw = (line) => {
      const args = [
        wkf * (x + line[0]),
        hkf * (y + line[1])
      ];
      line[0] % 2 ? ctx.moveTo(...args) : ctx.lineTo(...args);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ff1493';
      ctx.stroke();
      };
      ctx.closePath();
      axis.map(v => draw(v));
    }
}
