var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../../models/User");

router.get("/discord", passport.authenticate("discord"));
router.get("/discord/callback", passport.authenticate("discord", {
    failureRedirect: "/login",
    successRedirect: "/"
}));

module.exports = router;