'use strict';

const socket = io.connect();
let id;

// jQueryは地獄 #jQueryは地獄

// joinボタン押下
$('#join-button').on('click', () => {
    let name = $('#name-holder').val();
    if (name !== '') {
        socket.emit('login', {name: name})
    }
});

// chat送信
$('#say-button').on('click', () => {
    let textBox = $('#chat-text');
    let text = textBox.val();
    if (text !== '') {
        socket.emit('chat', text);
        textBox.val('');
    }
});

socket.on('hello', (data) => {
    id = data;
    console.log("my socket id = " + id);
});

socket.on('info', (data) => {
    let msg;
    if (data.type = 'join') {
        msg = `${data.user.name} is joined!`;
    }
    let info = '<div class="chat"><div class="chat-text chat-info">' + msg + '</div></div>';
    $('#chat-box').append(info);
});

socket.on('chat', (data) => {
    console.log(data);
    let cssClass = "chat-text";
    const chatBox = $('#chat-box');

    // 自分の送信したチャットか否か
    if (data.user === id) {
        cssClass += " chat-me"
    }

    const msg = '<div class="chat"><div class="' + cssClass + '">' + data.text + '</div></div>';
    chatBox.append(msg);
    chatBox.animate({scrollTop: chatBox[0].scrollHeight}, 'fast');
});
