'use strict';

class ChatServer {
    constructor(http) {
        this.users = [];
        this.socket = require('socket.io')(http);
    }

    start() {
        this.socket.on('connection', (socket) => {
            socket.on('login', (data) => {
                console.log('login: ' + data);
                this.users.push(new User(socket));
            });
        });
    }
}


class User {
    constructor(socket) {
        this.socket = socket;
        this.onMessage();
    }

    onMessage() {
        this.socket.on('chat', (data) => {
            console.log('chat: ', (data));
            socket.emit('chat', data);
        });
    }
}


// mainTask
const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = 1067;
const chatServer = new ChatServer(http);


// チャットサーバ起動
chatServer.start();

// チャットサーバ起動
app.use(express.static('assets'));
http.listen(PORT);
