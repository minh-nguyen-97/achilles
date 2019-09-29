const express = require('express')
const route = express.Router();
const { isAuthenticated, isNotAuthenticated } = require('../../auth/auth-guard')

route.get('/', isNotAuthenticated, (req, res) => {
  res.render('index')
})

route.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('loggedIn/dashboard', {
    username: req.user.username
  })
})

module.exports = route