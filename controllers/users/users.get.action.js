var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/User');
var passport = require('passport');
require('../../config/passport')(passport);

module.exports.getAll = (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

module.exports.getOne = (req, res, next) => {
  var token = getToken(req.headers);
  if (token) {
    User.findById(req.params.id, function (err, user) {
      if (err) return next(err);
      res.json(user);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
