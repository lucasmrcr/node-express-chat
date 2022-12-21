const messageRepository = require('../repositories/message.repository');

const clientCache = {};

const updateMetrics = (io) => {
  messageRepository.find().then(messages => {
    const metrics = {
      clients_connection: Object.values(clientCache).map(client => client.name),
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
    clientCache[socket.id] = {name: 'inconnu'};
    updateMetrics(io);

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', {type: 'removed_user', data: socket.id});
      delete clientCache[socket.id];
      updateMetrics(io);
    });

    socket.on('chat', (text) => {
      const message = {from: clientCache[socket.id].name, text};
      io.emit('chat', message);
      messageRepository.create(message);
      updateMetrics(io);
    });

    socket.on('nickname', (nickname) => {
      clientCache[socket.id] = {name: nickname};
    });
  });
};