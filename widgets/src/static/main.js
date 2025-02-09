/* tslint:disable */

"use strict";

(async () => {
  //  Merchant chat
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMjY3M2ZhNDUtODJiOS00ODRjLWJjYmUtNDZkYTI1MGMyNjM5IiwiZW1haWwiOiJ0ZXN0Y2FzZXNAcGF5ZXZlci5kZSIsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlRlc3QiLCJyb2xlcyI6W3sicGVybWlzc2lvbnMiOlt7ImJ1c2luZXNzSWQiOiJiYzY0N2I2MS02MDM5LTRmNzMtYTYwYy05NzRjYzZkNzA3NzMiLCJhY2xzIjpbXX1dLCJ0YWdzIjpbXSwibmFtZSI6Im1lcmNoYW50In1dLCJ0b2tlbklkIjoiM2ZlY2RkY2YtMWY2Yi00YWRiLWE2ZWMtZWNlYzgzMWY1N2I2IiwidG9rZW5UeXBlIjowLCJjbGllbnRJZCI6bnVsbH0sImlhdCI6MTYxODQwNzYxNiwiZXhwIjoyNjE4NDk0MDE2fQ.h_mMIYa3X8JkaEAkc49Nj5qr4P8LLSYTxawSLkkhf3Q';
  const socket = io('/chat', {
    path: '/ws',
    transports: ['websocket'],
    query: {
      token,
    },
  });
  const apiUrl = `http://localhost:3021/api`;
  let roomId;
  let room;
  socket.on('unauthorized', (msg) => {
    console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
    throw new Error(msg.data.type);
  });
  socket.on('authenticated', () => {
    const businessId = 'bc647b61-6039-4f73-a60c-974cc6d70773';
    socket.emit('messages.ws-client.business-room.join', `${businessId}`);
    console.log('authenticated');
    (async () => {
      const chats = await (await fetch(`${apiUrl}/business/${businessId}/chats`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      })).json();
      console.log('available rooms', chats.map(chat => chat._id));

      const chatsSelect = document.getElementById('chats');
      chatsSelect.onchange = function() {
        const index = chatsSelect.selectedIndex;
        room = chats[index];
        roomId = room._id;

        chat.textContent = '';
        for (const message of room.lastMessages) {
          appendMessage(message);
          if (message.status !== 'read') {
            socket.emit('messages.ws-client.message.mark-read', message._id);
          }
        }
      }
      for (const chat of chats) {
        const option = document.createElement('option');
        option.value = chat._id;
        option.innerText = chat.title;
        chatsSelect.appendChild(option);
        socket.emit('messages.ws-client.chat-room.join', chat._id);
      }

      chatsSelect.selectedIndex = 0;
      chatsSelect.onchange();
    })();
  });
  socket.on('exception', function () {
    console.error('exception', arguments);
  })
  socket.on('connect', function () {
    console.log('connected to merchant chat');
  });
  socket.on('disconnect', function () {
    console.log('Disconnected', arguments);
  });
  socket.on('messages.ws-client.room.joined', function () {
    // user joined the room
    console.log('messages.ws-client.room.joined', arguments);
  })
  socket.on('messages.ws-client.room.left', function () {
    //  user left the room
  });
  socket.on('messages.ws-client.message.posted', function (data) {
    appendMessage(data);
  });
  socket.on('messages.ws-client.message.deleted', function (data) {
    // message was deleted
  });
  socket.on('messages.ws-client.message.updated', function (data) {
    //  message was updated
  });
  socket.on('messages.ws-client.message.withdraw', function (message, reason) {
    // previously posted message wasn't processed successfully
  });
  socket.on('messages.ws-client.chat.created', function (chat) {
    // new chat created
  socket.emit('messages.ws-client.chat-room.join', chat._id);
  });
  socket.on('messages.ws-client.chat.updated', function (chat) {
    // existing chat updated
  });
  socket.on('messages.ws-client.chat.deleted', function (chat) {
    // existing chat was deleted
  })

  function appendMessage(message) {
    chat.textContent += `${message.sentAt}: ${message.sender}: ${message.content} \n`;
  }

  // Actions
  function send() {
    const valueToSend = input.value;
    socket.emit('messages.ws-client.message.send', {
      content: valueToSend,
      chat: roomId,
      sentAt: new Date(),
    }, response => {
      chat.textContent += `me: ${valueToSend}\n`;
      console.log('response', response);
    });
  }
  const button = document.getElementById('send');
  button.onclick = send;
})();
