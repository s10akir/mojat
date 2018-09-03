'use strict';

class ChatServer {
    constructor(http) {
        this.socket = require('socket.io')(http);
    }

    start() {
        this.socket.on('connection', (socket) => {
            socket.on('Hello', (data) => {
                console.log('Hello: ' + data);
            });
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
