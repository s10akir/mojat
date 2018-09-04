'use strict';

class ChatServer {
    constructor(http) {
        this.users = [];
        this.socket = require('socket.io')(http);
        this.room = 'prime';  // とりあえずシングルルーム
    }

    start() {
        this.socket.on('connection', (socket) => {
            socket.on('join', (data) => {
                console.log('join: ' + data);
                socket.join(this.room);
                socket.emit('hello', socket.id);
                this.socket.to(this.room).emit('info', {type: 'join', user: {id: socket.id, name: data.name}});

                // ユーザインスタンスの生成、ユーザ配列へ格納
                this.users.push(new User(socket, data, socket.id));
            });

            socket.on('left', (data) => {
                let user;
                this.users.forEach(u=> {
                    if (u.id === data.id) {
                        user = u;
                    }
                });

                // なんらかの原因でjoinしたままのクライアントがゾンビしてることがあるため判定 (主にサーバ再起動時)
                if (user) {
                    console.log('left: ' + user.name);

                    this.socket.to(this.room).emit('info', {type: 'left', user: {id: user.id, name: user.name}});
                    socket.leave(this.room);
                }
            });


            // チャットの配送
            socket.on('chat', (data) => {
                let user;
                this.users.forEach(u => {
                    if (u.id === socket.id)
                    user = u;
                });

                console.log(user);

                this.socket.to(this.room).emit('chat', {text: data, user: {id: user.id, name: user.name}});
            });
        });
    }
}


class User {
    constructor(socket, data, id) {
        this.socket = socket;
        this.name = data.name;
        this.id = id;
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
