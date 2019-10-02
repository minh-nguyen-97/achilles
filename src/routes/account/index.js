require('dotenv').config();
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const User = require('../../models/user')
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


module.exports = route;