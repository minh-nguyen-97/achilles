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
    status: 'unseen'
  })

  await message.save();

  res.send('Message sent successfully')

})

route.get('/get-initial-messages/:chatting', async (req, res) => {
  const messages = await Message.find({
    $or : [{
        sender: req.user.username,
        receiver: req.params.chatting
      }, {
        receiver: req.user.username,
        sender: req.params.chatting
      }
    ]
  }).sort({ sentTime: -1 }).limit(10);

  res.send({messages})
})

route.get('/get-messages-after/:chatting', async (req, res) => {
  const afterTime = req.query.afterTime;
  // console.log(afterTime)

  const messages = await Message.find({
    $and: [
      {
        $or : [{
            sender: req.user.username,
            receiver: req.params.chatting
          }, {
            receiver: req.user.username,
            sender: req.params.chatting
          }
        ]
      },
      { sentTime: { $lt: afterTime}}
    ]
  }).sort({ sentTime: -1 }).limit(10);
  res.send({messages})
})

module.exports = route;