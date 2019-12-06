var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);

/* User Profile */
router.get('/profile', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), function (req, res, next) {
  return res.render('pages/profile', { title: 'Profile', user: req.user})
})

module.exports = router;