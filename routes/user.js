var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var checky = require('../controllers/user/checky');

/* User Profile */
router.get('/profile', passport.authorize('jwt', { session: false, failWithError: true }), function (err, req, res, next) {
  if (err) {
    next(err)
    return res.render('errors/401', { title: 'Unauthorized', user: req.user})
  }
  next();
  return res.render('pages/profile', { title: 'Profile', user: req.user})
})

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    return next();
  } else
    res.flash('danger', 'You are already logged in!');
    return res.redirect("/") 
}

module.exports = router;