const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const messageSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.String,
    ref: 'User'
  },
  receiver:{
      type: Schema.Types.String,
      ref: 'User'
  },
  messageContent: {
    type: String,
  },
  status: {
    type: String,
  },
  sentTime: {
    type: Date,
    default: Date.now
  }
})


const Message = mongoose.model('Message', messageSchema);

module.exports = Message