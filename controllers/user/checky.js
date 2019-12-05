var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/User");

module.exports = function (req, res, next) {
  if (req.cookies) {
    if (typeof req.cookies.token != "undefined") {
      console.log("hello token")
      jwt.verify(req.cookies.token, settings.secret, function (err, data) {
        if (err) return next(err)
        req.user = data.user
        console.log(data)
        User.findOne( {username: data.user.username}, function (err, thingey) {
          if (err) return next(err)
          if (data.user.rank != thingey.rank) {
            res.clearCookie('token');
            res.flash("danger", "Outdated token details, logging out")
            next(null, "Guest")
            return res.redirect('/')
          } else if (thingey.rank == "Banned") {
            next(null, "Banned")
            return res.render('pages/banned', {title: "Banned", user: req.user})
          } else {
            return next(null, thingey.rank)
          }
        })
      })
    } else {
      return next(null, "Guest")
    }
  } else {
    return next(null, "Guest")
  }
} 