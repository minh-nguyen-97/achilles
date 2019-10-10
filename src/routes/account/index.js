require('dotenv').config();
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const User = require('../../models/user')
const Request = require('../../models/friend-request')
const Friend = require('../../models/friend')
const express = require('express')
const route = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `avatars/${req.user.username}_${Date.now().toString()}.png`)
    }
  })
})

route.post('/profile/upload', upload.single('avatar'), async function(req, res) {
  // const user = await User.findOne({username: req.user.username})

  const oldAvaUrl = req.user.avatarURL;
  const oldAvaKey = oldAvaUrl.split('/').slice(3).join('/');
  // console.log(oldAvaKey);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: oldAvaKey
  }
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });

  req.user.avatarURL = req.file.location;
  await req.user.save();

  res.send({avatarURL: req.file.location})
});

route.get('/profile', (req, res) => {
  res.render('loggedIn/profile', {
    username: req.user.username,
    email: req.user.email,
    avatarURL: req.user.avatarURL
  })
})

route.post('/send-friend-request', async (req, res) => {
  const receiver = req.body.receiver;
  const request = new Request({
    sender: req.user.username,
    receiver,
    status: 'unseen',
  })
  
  await request.save();

  res.send('Successfully request')
})


route.delete('/delete-friend-request/:receiver', async (req, res) => {
  const receiver = req.params.receiver;
  // console.log(req.user.username, receiver)
  const request = await Request.findOne({
    sender: req.user.username,
    receiver
  });

  await request.remove();

  res.send('Successfully delete request')
})

route.delete('/ignore-friend-request/:sender', async (req, res) => {
  const sender = req.params.sender;

  const request = await Request.findOne({
    sender,
    receiver: req.user.username
  });

  await request.remove();

  res.send('Successfully ignore request')
})

route.post('/accept-friend-request', async (req, res) => {
  const sender = req.body.sender;
  const receiver = req.user.username;

  const request = await Request.findOne({
    sender,
    receiver
  });

  await request.remove();

  // create two-way friendship
  const friend1 = new Friend({
    username: sender,
    friend: receiver
  })

  await friend1.save();

  const friend2 = new Friend({
    username: receiver,
    friend: sender
  })

  await friend2.save();

  res.send('Successfully accept request')
})

route.delete('/unfriend/:receiver', async (req, res) => {
  receiver = req.params.receiver;
  sender = req.user.username;

  const friend1 = await Friend.findOne({
    username: sender,
    friend: receiver
  })

  await friend1.remove();

  const friend2 = await Friend.findOne({
    username: receiver,
    friend: sender
  })

  await friend2.remove();

  res.send('Unfriend successfully')
})

// get number of unseen friend request
route.get('/number-unseen-friend-request', async(req, res) => {
  // console.log(req.user.username);
  const numOfUnseenRequests = await Request.countDocuments({ 
    receiver: req.user.username,
    status: 'unseen'
  })

  res.send({numOfUnseenRequests});
})

route.get('/unseen-friend-request', async(req, res) => {
  let unseenRequests = await Request.find({
    receiver: req.user.username,
    status: 'unseen'
  }).sort({ requestTime: -1 })

  unseenRequests = await Promise.all(
    unseenRequests.map(async (request) => {
      const sender = await User.findOne({
        username: request.sender
      })

      return {
        sender: sender.username,
        senderAvatarURL: sender.avatarURL
      }
    })
  )

  res.send({unseenRequests});
})

module.exports = route;