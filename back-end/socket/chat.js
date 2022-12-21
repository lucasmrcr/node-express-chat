const messageRepository = require('../repositories/message.repository');

const updateMetrics = (io) => {
  messageRepository.find().then(messages => {
    const metrics = {
      clients_connection: Object.values(io.engine.clients).filter(client => client.connected).map(client => client.id),
      clients: messages.reduce((acc, message) => {
        acc[message.from] = acc[message.from] ? acc[message.from] + 1 : 1;
        return acc;
      }, {}),
    };
    io.emit('metrics', metrics);
  });
};

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`);
    io.emit('notification', {type: 'new_user', data: socket.id});
    updateMetrics(io);

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', {type: 'removed_user', data: socket.id});
      updateMetrics(io);
    });

    socket.on('chat', (text) => {
      const message = {from: socket.id, text};
      io.emit('chat', message);
      messageRepository.create(message);
    });

    socket.on('nickname', (nickname) => {
      socket.id = nickname;
      updateMetrics(io);
    });
  });
};