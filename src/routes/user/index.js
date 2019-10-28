const express = require('express')
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const router = express.Router();
const { isNotAuthenticated, isAuthenticated } = require('../../auth/auth-guard')

router.get('/login', isNotAuthenticated,  (req, res) => {
  res.render('login')
})

router.get('/signup', isNotAuthenticated, (req, res) => {
  res.render('signup')
})

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  let warnings = []

  if (password.length < 6) 
    warnings.push('Password must have at least 6 characters')
  
  const existingEmail = await User.findOne({email});
  if (existingEmail) {
    warnings.push('Email has already been registered')
  }

  const existingUsername = await User.findOne({username});
  if (existingUsername) {
    warnings.push('Username has already been registered')
  }

  if (warnings.length > 0) {
    res.render('signup', {
      warnings,
      username,
      email,
      password
    })
  } else {

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hashPass) => {
        const newUser = new User({
          username,
          email,
          password: hashPass,
          avatarURL: 'https://bit.ly/2ocm1Sa'
        });
        newUser.save().then( async (user) => {
          req.flash('success_flash', 'You are now registered and can log in')
          res.redirect('./login')
        })
        .catch(err => console.log(err))
      })
    })

  }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: '/user/login',
    failureFlash: true
  })
)

router.get('/logout', isAuthenticated, async (req, res) => {
  await req.logout();
  await req.flash('success_flash', 'You are logged out')
  res.redirect('/user/login');
})

module.exports = router;

