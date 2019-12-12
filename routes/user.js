var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);

/* User Profile */
router.get('/profile', isLoggedIn, function (req, res, next) {
  return res.render('pages/profile', { title: 'Profile', user: req.user})
})

router.route('/settings')
  .get(isLoggedIn, function (req, res, next) {
    return res.render('pages/settings', { title: 'Settings', user: req.user})
  })

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    req.flash('danger', 'You are not logged in!');
    console.log('user isnt logged in')
    return res.redirect("/") 
  }
}

module.exports = router;