const messageRepository = require('../repositories/message.repository');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`);
    io.emit('notification', {type: 'new_user', data: socket.id});

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', {type: 'removed_user', data: socket.id});
    });

    socket.on('chat', (text) => {
      const message = {from: socket.id, text};
      io.emit('chat', message);
      messageRepository.create(message);
    });
  });
};