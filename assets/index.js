'use strict';

const socket = io.connect();

socket.emit('Hello', 'hello!');
