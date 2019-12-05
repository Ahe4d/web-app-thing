var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/User");

router.post('/login', async (req, res, next) => {
  console.log("hit login")
  passport.authenticate('login', {session: false }, async (err, user, info) => { 
    try {
      if (err || !user) {
        const error = new Error('An error occured')
        return res.redirect("")
      }
      req.login(user, { session : false }, async (error) => {
        if (error) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, username: user.username, id: user.id, rank: user.rank };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, settings.secret, { expiresIn: 86400 });
        //Send back the token to the user
        console.log("SUCCESS!!!!")
        return res.json({ success: true, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;