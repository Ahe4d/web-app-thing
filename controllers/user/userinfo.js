var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/User");

router.get('/get/:id', async (req, res, next) => {
  passport.authenticate('jwt', {session: false }, async (err, user, info) => { 
    if (err) return next(err)

    if (user.id == req.params.id || user.rank == "Admin")
      next();
      return res.json(User.getUser(req.params.id))
  })
})

module.exports = router;