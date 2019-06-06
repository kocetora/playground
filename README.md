# Multiplayer gamer

### You may add your game following the next guide: 
#### Project consists of three independent parts: 
###   1. Websocket server
It's not necessary for you to understand this peace of code to add you game.  
Path ./main.js
Routing scheme /room/token/json


## 1. The operating principle of the server based on the WebSocket(bi-directional data exchange in real time)
![WS](https://user-images.githubusercontent.com/43109766/59032548-3e54c100-886f-11e9-824e-38485d9effe5.png)


## Routing reference
### / - root.
### /create/${token} - API call for creating room.
### /room/${token} - client interface.
### /room/${token}/json - API call for retrieving room data(token, history).

```
  route(url) {
    if (url === '/') return fs.promises.readFile('./static/index.html');
    const request = url.split('/');
    request.shift();
    const [command, token, query] = request;
    if (command === 'room') {
      if (query === 'json') {
        return this.json(token);
      } else {
        const name = this.rooms[token].name;
        const file = query ? query : 'index.html';
        return fs.promises.readFile(`./static/${name}/${file}`);
      }
    } else if (command === 'create') {
      return JSON.stringify({ token: this.create(token) });
    } else {
      return fs.promises.readFile(`./static${url}`);
    }
}
```

### 2. Event emmiter
Path ./static/common.js
```
class SocketEventEmitter extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this._emit = this.emit;
    this.emit = (event, data) => {
      this.socket.send(JSON.stringify({ event, data }));
    };
    const that = this;
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      that._emit(message.event, message.data);
    };
  }

  load(history) {
    const that = this;
    history.forEach(event => {
      const message = JSON.parse(event);
      that._emit(message.event, message.data);
    });
  }
}

const getUserId = () => {
  if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', Math.floor(Math.random() * 10e12)) + 1;
  }
  return localStorage.getItem('userId');
};
```

### 3. The game and chat main
Folder ./static/tictactoe

##### Path ./static/tictactoe/main.js
```
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
``` 
### 4. Chat in the game 
##### Path ./static/tictactoe/chat.js
```
class Chat {
  constructor(chat, msg) {
    this.chat = document.getElementById(chat);
    this.msg = document.getElementById(msg);
    const wW = window.innerWidth;
    const wH = window.innerHeight;
    let width;
    let height;
    if( wH < wW ){
      height = wH; 
      width = (wW - wH) * 0.9999;
    } else {
      height = wH - wW; 
      width = wW;
    }
    this.chat.style.height = height.toString() + 'px';
    this.chat.style.width = width.toString() + 'px';
  }
  write(text, color) {
    const line = document.createElement('div');
    line.innerHTML = `<p>${text}</p>`;
    line.style.color = color;
    this.chat.appendChild(line);
  }
  setEmitter(emitter) {
    const that = this;
    this.msg.addEventListener('keydown', event => {
      if (event.keyCode === 13) {
        const text = that.msg.value;
        that.msg.value = '';
        emitter.emit('msg', { from: getUserId(), text });
      }
    });
    emitter.on('msg', msg => {
      if (getUserId() === msg.from) {
        that.write(`me: ${msg.text}`, 'crimson');
      } else {
        that.write(`friend: ${msg.text}`, 'white');
      }
    });
  }
}
```
### 5. Canvas  visualisation
##### Path ./static/tictactoe/board.js
```
this.canvas = document.getElementById(id);
this.ctx = this.canvas.getContext('2d');
//...
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
```
