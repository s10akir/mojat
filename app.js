'use strict';

class ChatServer {
    constructor(http) {
        this.users = [];
        this.socket = require('socket.io')(http);
        this.room = 'prime';  // とりあえずシングルルーム
    }

    start() {
        this.socket.on('connection', (socket) => {
            socket.on('login', (data) => {
                console.log('login: ' + data);
                socket.join(this.room);
                this.socket.to(this.room).emit('info', data.name + ' is connected');

                // ユーザインスタンスの生成、ユーザ配列へ格納
                this.users.push(new User(socket, data));
            });


            // チャットの配送
            socket.on('chat', (data) => {
                this.socket.to(this.room).emit('chat', data);
            });
        });
    }
}


class User {
    constructor(socket, data) {
        this.socket = socket;
        this.name = data.name;
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
