const User = require('../models/user')
const LocalStategy = require('passport-local').Strategy;

module.exports = (passport) => {
  passport.use(new LocalStategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email, password, done) => {

      User.findOne({ email }, async (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, req.flash('error_flash', 'Invalid username or password'));
        }

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
          return done(null, false, req.flash('error_flash', 'Invalid username or password'));
        }
        return done(null, user, req.flash('success_flash', `Welcome to Achilles, ${user.username}`));
      });

    })
  );

  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      return done(err, user);
    });
  });

}

