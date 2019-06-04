'use strict';
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.wrappers = new Map();
  }

  on(name, fn) {
    const event = this.events.get(name);
    if (event) event.add(fn);
    else this.events.set(name, new Set([fn]));
  }

  once(name, fn) {
    const wrapper = (...args) => {
      this.remove(name, wrapper);
      fn(...args);
    };
    this.wrappers.set(fn, wrapper);
    this.on(name, wrapper);
  }

  emit(name, ...args) {
    const event = this.events.get(name);
    if (!event) return;
    for (const fn of event.values()) {
      fn(...args);
    }
  }

  remove(name, fn) {
    const event = this.events.get(name);
    if (!event) return;
    if (event.has(fn)) {
      event.delete(fn);
      return;
    }
    const wrapper = this.wrappers.get(fn);
    if (wrapper) {
      event.delete(wrapper);
      if (event.size === 0) this.events.delete(name);
    }
  }

  clear(name) {
    if (name) this.events.delete(name);
    else this.events.clear();
  }

  count(name) {
    const event = this.events.get(name);
    return event ? event.size : 0;
  }

  listeners(name) {
    const event = this.events.get(name);
    return new Set(event);
  }

  names() {
    return [...this.events.keys()];
  }
}
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
