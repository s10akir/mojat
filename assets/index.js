'use strict';

const socket = io.connect();
let id;
let users;

// jQueryは地獄 #jQueryは地獄

// joinボタン押下
let isConnected = false;
$('#join-button').on('click', () => {
    if (!isConnected) {
        let name = $('#name-holder').val();
        if (name !== '') {
            socket.emit('join', {name: name})
        }

        $('#name-holder').prop('disabled', true);
        $('#join-button-text').text('Left!');
        $('#chat-text').prop('disabled', false);
        $('#say-button').prop('disabled', false);
        isConnected = !isConnected;
    } else {
        socket.emit('left', {id: id});

        $('#name-holder').prop('disabled', false);
        $('#join-button-text').text('Join!');
        $('#chat-text').prop('disabled', true);
        $('#say-button').prop('disabled', true);
        $('#online-users').empty();
        isConnected = !isConnected;
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

$(window).on('beforeunload', () => {
    if (isConnected) {
        socket.emit('left');
    }
});

// 自ID記憶
socket.on('hello', (data) => {
    id = data.id;
    console.log("my socket id = " + id);
    users = data.online;
    renderOnlineUsers();
});

// サーバからのメッセージを受信したときの処理
socket.on('info', (data) => {
    let msg;
    if (data.type === 'join') {
        msg = `${data.user.name} is joined!`;
        if (data.user.id !== id) {
            users.push(data.user);
            renderOnlineUsers()
        }
    } else if (data.type === 'left') {
        msg = `${data.user.name} is leaved!`;
        if (data.user.id !== id) {
            users.splice(users.indexOf(data.user));
            renderOnlineUsers()
        }
    }

    let info = '<div class="chat"><div class="chat-text chat-info">' + msg + '</div></div>';
    $('#chat-box').append(info);
    chatScroll();
});

// チャットを受信したときの処理
socket.on('chat', (data) => {
    console.log(data);
    let cssClass = "chat-text";
    const chatBox = $('#chat-box');

    // 自分の送信したチャットか否か
    if (data.user.id === id) {
        cssClass += " chat-me"
    }

    const msg = '<div class="chat"><div class="' + cssClass + '"><div class="chat-name">' + data.user.name + '</div>' + data.text + '</div></div>';
    chatBox.append(msg);
    chatScroll();
});

// チャット領域を最下部までスクロールする
function chatScroll() {
    const chatBox = $('#chat-box');
    chatBox.animate({scrollTop: chatBox[0]._scrollHeight}, 'fast');
}

function renderOnlineUsers() {
    const onlineUsers = $('#online-users');
    onlineUsers.empty();
    users.forEach(u => {
        let dom = '<div><b>' + u.name + '</b> (' + u.id + ')</div>';
        onlineUsers.append(dom);
    });
}
