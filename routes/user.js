var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var checky = require('../controllers/user/checky');

/* User Profile */
router.get('/profile', passport.authenticate('jwt', { session: false, failWithError: true }), function (err, req, res, next) {
  console.log("hit profile");
  console.log('hello passport')
  if (err) {
    next(err)
    return res.render('errors/401', { title: 'Unauthorized', user: req.user})
  }
  next();
  console.log(err)
  return res.render('pages/profile', { title: 'Profile', user: req.user})
})

module.exports = router;