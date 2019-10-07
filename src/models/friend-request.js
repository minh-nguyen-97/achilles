const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const requestSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.String,
    ref: 'User'
  },
  receiver:{
    type: Schema.Types.String,
    ref: 'User'
  },
  status: {
    type: String
  }
})


const Request = mongoose.model('Request', requestSchema);

module.exports = Request;