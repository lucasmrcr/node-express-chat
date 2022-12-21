const express = require('express');
const router = express.Router();
const messageRepository = require('../repositories/message.repository');

router.get('/', (req, res) => {
  messageRepository.find()
    .then(messages => res.status(200).json(messages))
    .catch(console.error);
});

module.exports = router;