const Message = require('../../models/message')
const express = require('express')
const route = express.Router();

route.post('/send-message', async (req, res) => {
  const sender = req.user.username;
  const receiver = req.body.receiver;
  const messageContent = req.body.messageContent;

  const message = new Message({
    sender,
    receiver,
    messageContent,
    status: 'unchecked'
  })

  await message.save();

  res.send('Message sent successfully')

})

module.exports = route;