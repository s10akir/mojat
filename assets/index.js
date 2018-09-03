'use strict';

const socket = io.connect();
let id;

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
    let msg = '<div class="chat"><div class="chat-text chat-info">' + data + '</div></div>';
    $('#chat-box').append(msg);
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
