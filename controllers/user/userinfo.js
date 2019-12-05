var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/User");

router.get('/get/:id', async (req, res, next) => {
  passport.authenticate('jwt', {session: false }, async (err, user, info) => { 
    try {
      if (user.id == req.params.id || user.rank == "Admin")
        return res.json(User.getUser(req.params.id))
    } catch (err) {
      return next(err)
    }
  })
})

module.exports = router;