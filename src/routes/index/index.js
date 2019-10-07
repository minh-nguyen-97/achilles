const User = require('../../models/user')
const Friend = require('../../models/friend')
const Request = require('../../models/friend-request')
const express = require('express')
const route = express.Router();
const { isAuthenticated, isNotAuthenticated } = require('../../auth/auth-guard')

route.get('/', isNotAuthenticated, (req, res) => {
  res.render('index')
})

route.get('/dashboard', isAuthenticated, async (req, res) => {
  let friends = await Friend.find({ username: req.user.username })
  friends = friends.map( friend => friend.friend)
  // console.log(friends)

  let sentRequests = await Request.find({ sender: req.user.username })
  sentRequests = sentRequests.map( request => request.receiver)
  // console.log(sentRequests)

  let receivedRequests = await Request.find({ receiver: req.user.username })
  receivedRequests = receivedRequests.map( request => request.sender)
  // console.log(receivedRequests)

  const notSuggestions = [...friends, ...sentRequests, ...receivedRequests, req.user.username]
  // console.log(notSuggestions)

  let suggestions = await User.find({ username: {$nin: notSuggestions}});
  suggestions = suggestions.map( suggestion => {
    return {
      username: suggestion.username,
      avatarURL: suggestion.avatarURL
    }
  })
  console.log(suggestions)
  
  res.render('loggedIn/dashboard', {
    username: req.user.username,
    avatarURL: req.user.avatarURL,
    suggestions
  })
})

module.exports = route