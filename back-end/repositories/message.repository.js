const mongoose = require('mongoose');
const messageSchema = require('../models/message.model');
module.exports = mongoose.model('Message', messageSchema);