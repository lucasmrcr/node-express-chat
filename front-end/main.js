(function () {
  const server = 'http://127.0.0.1:3000';
  const socket = io(server);
  const messageContainer = document.querySelector('#message-container');
  const domChatHandler = {
    messageReceivedEvent: function (data) {
      const li = document.createElement('li');
      li.classList.add('clearfix');
      const divName = document.createElement('div');
      divName.classList.add('name');
      const spanName = document.createElement('span');
      spanName.textContent = data.from;
      divName.appendChild(spanName);
      li.appendChild(divName);
      const divMessage = document.createElement('div');
      divMessage.classList.add('message');
      const p = document.createElement('p');
      p.textContent = data.text;
      divMessage.appendChild(p);
      const spanTime = document.createElement('span');
      spanTime.classList.add('msg-time');
      spanTime.textContent = new Date().toLocaleTimeString();
      divMessage.appendChild(spanTime);
      li.appendChild(divMessage);
      messageContainer.appendChild(li);
    }
  }

  socket.on('notification', (data) => {
    console.log('Message depuis le seveur:', data);
  });

  socket.on('chat', domChatHandler.messageReceivedEvent);

  const sendMessageText = document.querySelector('#send-message-field');
  const sendMessageButton = document.querySelector('#send-message-btn');

  sendMessageButton.addEventListener('click', () => {
    socket.emit('chat', sendMessageText.value);
    sendMessageText.value = '';
  });

  fetch(`${server}/messages`).then((res) => {
    return res.json();
  }).then((data) => {
    for(let datum of data) {
      domChatHandler.messageReceivedEvent(datum);
    }
  });

})();