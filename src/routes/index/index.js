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
  let friends = await Friend.find({ username: req.user.username }).sort({ createdTime: -1 })
  // for suggestions
  friends = friends.map( friend => friend.friend)

  let renderFriends = await User.find({ username : {$in: [...friends]} });
  renderFriends = renderFriends.map( friend => {
    return {
      username: friend.username,
      avatarURL: friend.avatarURL
    }
  })
  // console.log(renderFriends)

  let sentRequests = await Request.find({ sender: req.user.username })
  sentRequests = sentRequests.map( request => request.receiver)
  // console.log(sentRequests)

  let receivedRequests = await Request.find({ receiver: req.user.username })
  receivedRequests = receivedRequests.map( request => request.sender)
  // console.log(receivedRequests)

  const notSuggestions = [...friends, ...sentRequests, ...receivedRequests, req.user.username]
  // console.log(notSuggestions)

  let suggestions = await User.find({ username: {$nin: notSuggestions}}).limit(30);
  suggestions = suggestions.map( suggestion => {
    return {
      username: suggestion.username,
      avatarURL: suggestion.avatarURL
    }
  })
  // console.log(suggestions)

  // console.log(req.session);
  
  res.render('loggedIn/dashboard', {
    username: req.user.username,
    avatarURL: req.user.avatarURL,
    suggestions,
    friends: renderFriends
  })
})

module.exports = route