/* tslint:disable */

(async () => {
  const socket = io('/widget', {
    path: '/ws',
    transports: ['websocket'],
    query: {
      businessId: 'bc647b61-6039-4f73-a60c-974cc6d70773',
    },
  });
  socket.on('messages.ws-client.message.posted', function (data) {
    appendMessage(data);
  });

  socket.on('authenticated', (result) => {
  });

  function appendMessage(message) {
    chat.textContent += `${message.sentAt}: ${message.sender}: ${message.content} \n`;
  }
})().catch(e => {
  console.error(e);
});
