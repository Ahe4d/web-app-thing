var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/register', async (req, res, next) => {
  passport.authenticate('register', { session: false }), async (req, res, next) => {
    res.json({ 
      success: true,
      user: req.user 
    });
  }
});

module.exports = router;