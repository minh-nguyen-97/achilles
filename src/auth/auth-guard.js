module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash('error_flash', 'Please log in to view resources')
    res.redirect('/user/login')
  },
  isNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/dashboard')
  }
}