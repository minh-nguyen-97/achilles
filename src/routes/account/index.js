const express = require('express')
const route = express.Router();

route.get('/profile', (req, res) => {
  res.render('loggedIn/profile', {
    username: req.user.username,
    email: req.user.email,
    avatarURL: 'https://bit.ly/2nyHX9T'
  })
})

module.exports = route;