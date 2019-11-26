var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/register', passport.authenticate('register', { session: false }) , async (req, res, next) => {
  res.json({ 
    msg: 'Successfully registered!',
    user: req.user 
  });
});

module.exports = router;