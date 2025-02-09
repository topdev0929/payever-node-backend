/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/quotes */
/* tslint:disable */

let i = 0;
const msg = { '_id': 'e0deaaf7-479b-4fae-8aff-c00a6cfbb5c7', messageId : '884fa0a1-3a3b-4114-bbf7-2996f166fa77' };
(async () => {
  const socket = io('ws://localhost:3000/live-chat', {
    path: '/ws',
    transports: ['websocket'],
    query: {
      businessId: '563fb16c-f19b-430c-a962-48a8f1b2894f',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imd1ZXN0SGFzaCI6IjA3YzRjNTY3NjQxNDc2ODgyMzFmNzEyY2UzNDg0NzY1ZWY2MTYzNzQyYmYwNjhjNzBjYjkyNmZjM2RmNzBkY2UiLCJoYXNoIjoiMzc2YzZmNmM3MGYwYWM4ZTkwOTI4Mjc4YjM4YmM5ZmUwZmQyODI4MDM1YTJlODMzZmY2ODAxMWViZjNmNGU0YSIsInJlbW92ZVByZXZpb3VzVG9rZW5zIjpmYWxzZSwicm9sZXMiOlt7Im5hbWUiOiJndWVzdCIsImFwcGxpY2F0aW9ucyI6W119XSwidG9rZW5JZCI6ImQwM2U3NjA4LThhOWItNDVlNi1iNGU3LTFkMTY4NDE2MGM1NSJ9LCJpYXQiOjE3MDg2MjE2NDIsImV4cCI6MTcwODYyNTI0Mn0.ulT0aQYL9zFJHXZHfLIYN0aQwpqOxIAju2b_qowfjR8'
    },
  });

  document.getElementById('editMessage').addEventListener('click', () => {
    msg.content = `98-${i++}`;
    socket.emit("messages.ws-client.message.update", msg);
  });

  document.getElementById('deleteMessage').addEventListener('click', () => {
    msg.deleteForEveryOne = true;
    socket.emit("messages.ws-client.message.delete", msg);
  });
  
  document.getElementById('pinMessage').addEventListener('click', () => {
    msg.forAllUsers = true;
    msg.chat = '1f2a3450-9a7f-443b-ad56-d7bbe421bf2d';
    socket.emit("messages.ws-client.message.pin", msg);
  });
  
  document.getElementById('unpinMessage').addEventListener('click', () => {
    msg.chat = '7ee03d0e-ea5b-4a18-933a-ea6bff8fd239';
    socket.emit("messages.ws-client.message.unpin", msg);
  });


  socket.on('messages.ws-client.message.posted', function (data) {
    appendMessage(data);
  });

  socket.on('authenticated', (result) => {
    msg.chat = result.chat._id;
    msg.contact = result.contact._id;
    chat.textContent += 'Authenticated';
    console.log('authenticated', result);
  });

  function appendMessage(message) {
    chat.textContent += `${message.sentAt}: ${message.sender}: ${message.content} \n`;
  }
})().catch(e => {
  console.error(e);
});
