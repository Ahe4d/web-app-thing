var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../../models/User");

module.exports.register = (req, res) => {
  if (!req.body.username || !req.body.password)
    res.json({success: false, msg: 'Please pass username and password.'});
  else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    // save the user
    console.log("attempting to save user \"" + newUser.username + "\"")
    newUser.save(function (err) {
      if (err) return res.json({success: false, msg: 'Username already exists.'});
      res.json({success: true, msg: 'Successfuly created new user.'});
    });
  }
};

module.exports.login = (req, res) => {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;

    if (!user)
      res.status(401).send({success: false, msg: 'Authentication failed.'});
    else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else
          res.status(401).send({success: false, msg: 'Authentication failed.'});
      });
    }
  });
};

module.exports.delete = (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    var rankAuth = getRank(token);
    rankAuth.then(function (rank) { 
      if (rank != "Admin")
        res.status(401).send({success: false, msg: 'Unauthorized.'});
      else {
        User.deleteOne({
          username: req.body.victim
        }, function (err, victim) {
          if (err) return handleError(err);
  
          if (!victim)
            return res.status(304).send({success: false, msg: 'User not found!'});
          else 
            return res.status(200).send({success: true, msg: 'Deleted user!'});
        });
      }
    })
    
  } else
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2)
      return parted[1];
    else
      return null;
  } else
    return null;
};

getRank = function (token) {
  return new Promise((resolve, reject) => {
    result = jwt.verify(token, settings.secret)
    User.findOne({  
      username: result.username
    }, function (err, user) {
      if (err) reject(err);

      resolve(user.rank)
    });
  });
};