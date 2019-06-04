'use strict';
const Websocket = require('websocket').server;
const http = require('http');
const fs = require('fs');
class GameMaster {
  constructor() {
    this.rooms = {};
  }
  create(name) {
    const token = Math.floor(Math.random() * 10e12) + 1;
    if (!this.rooms[token]) {
      this.rooms[token] = { name, history: [], users: [] };
      return token;
    } else {
      return this.create(name);
    }
  }
  json(token) {
    if (this.rooms[token]) {
      const history = this.rooms[token].history;
      return JSON.stringify({ token, history });
    } else {
      return 'Room not found';
    }
  }
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
  start(port) {
    const httpError = (res, status, message) => {
      res.statusCode = status;
      res.end(`"${message}"`);
    };
    const server = http.createServer(async (req, res) => {
      try {
        const data = await this.route(req.url);
        res.end(data);
      } catch (err) {
        httpError(res, 404, 'File is not found');
      }
    });
    server.listen(port);
    const ws = new Websocket({
      httpServer: server,
      autoAcceptConnections: false
    });
    ws.on('request', req => {
      const path = req.resourceURL.path.split('/');
      path.shift();
      const token = path.shift();
      if (this.rooms[token]) {
        const connection = req.accept('', req.origin);
        this.rooms[token].users.push(connection);
        connection.on('message', message => {
          const data = message[`${message.type}Data`];
          this.rooms[token].history.push(data);
          this.rooms[token].users.forEach(client => client.send(data));
        });
      } else {
        req.reject();
      }
    });
  }
}
const game = new GameMaster();
game.start(8000);
