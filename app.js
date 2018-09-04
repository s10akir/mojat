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
                // ユーザインスタンスの生成、ユーザ配列へ格納
                const user = new User(data, socket.id);
                this.users.push(user);

                socket.join(this.room);
                console.log('join: ' + user.name);

                // ユーザの固有idとオンラインユーザ通知
                let online = [];
                this.users.forEach(u => {
                    online.push({id: u.id, name: u.name});
                });
                socket.emit('hello', {id: socket.id, online: online});
                this.socket.to(this.room).emit('info', {type: 'join', user})
            });

            socket.on('left', () => {
                let user;
                this.users.forEach(u=> {
                    if (u.id === socket.id) {
                        user = u;
                    }
                });

                // なんらかの原因でjoinしたままのクライアントがゾンビしてることがあるため判定 (主にサーバ再起動時)
                if (user) {
                    console.log('left: ' + user.name);
                    this.socket.to(this.room).emit('info', {type: 'left', user})

                    socket.leave(this.room);
                    this.users.splice(this.users.indexOf(user), 1);
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
    constructor(data, id) {
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
