const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  from: { type: String, required: true },
  text: { type: String, required: true },
});
 module.exports = messageSchema