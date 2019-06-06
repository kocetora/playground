'use strict';
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
