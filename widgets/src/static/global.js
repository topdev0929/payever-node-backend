/* tslint:disable */

(async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMjY3M2ZhNDUtODJiOS00ODRjLWJjYmUtNDZkYTI1MGMyNjM5IiwiZW1haWwiOiJ0ZXN0Y2FzZXNAcGF5ZXZlci5kZSIsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlRlc3QiLCJyb2xlcyI6W3sicGVybWlzc2lvbnMiOlt7ImJ1c2luZXNzSWQiOiJiYzY0N2I2MS02MDM5LTRmNzMtYTYwYy05NzRjYzZkNzA3NzMiLCJhY2xzIjpbXX1dLCJ0YWdzIjpbXSwibmFtZSI6Im1lcmNoYW50In1dLCJ0b2tlbklkIjoiM2ZlY2RkY2YtMWY2Yi00YWRiLWE2ZWMtZWNlYzgzMWY1N2I2IiwidG9rZW5UeXBlIjowLCJjbGllbnRJZCI6bnVsbH0sImlhdCI6MTYxODQwNzYxNiwiZXhwIjoyNjE4NDk0MDE2fQ.h_mMIYa3X8JkaEAkc49Nj5qr4P8LLSYTxawSLkkhf3Q';
  const socket = io('localhost:9940/', {
    path: '/ws',
    transports: ['websocket'],
    query: {
      token,
    },
  });

  appendMessage({sentAt:'2022-05-05 12:53:32', sender: 'emulator', content:'Welcome' });

  socket.on('push-notification', function (data) {
    appendMessage(data);
  });

  socket.on('authenticated', (result) => {
    socket.emit('messages.ws-client.business-room.join', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  function appendMessage(message) {
    chat.textContent += `${message.sentAt}: ${message.sender}: ${message.content} \n`;
  }
})().catch(e => {
  console.error(e);
});
