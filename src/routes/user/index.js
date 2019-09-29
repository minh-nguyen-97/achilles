const express = require('express')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  let warnings = []

  if (password.length < 6) 
    warnings.push('Password must have at least 6 characters')
  
  const existingUser = await User.findOne({email});
  if (existingUser) {
    warnings.push('Email has already been registered')
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
          password: hashPass
        });
        newUser.save().then( (user) => {
          req.flash('success_flash', 'You are now registered and can log in')
          res.redirect('./login')
        })
      })
    })
    .catch(err => console.log(err))

  }
})

module.exports = router;

