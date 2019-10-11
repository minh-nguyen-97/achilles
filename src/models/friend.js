const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const friendSchema = new mongoose.Schema({
  username: {
    type: Schema.Types.String,
    ref: 'User'
  },
  friend:{
      type: Schema.Types.String,
      ref: 'User'
  },
  createdTime: {
    type: Date,
    default: Date.now
  }
})


const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;