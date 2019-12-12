var passport = require('passport');
var settings = require('../../config/settings');
require('../../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../../models/User");

router.get("/discord", passport.authorize('discord'));
router.get("/discord/callback", passport.authorize('discord', {
    failureRedirect: "/user/settings",
    failureFlash: "Failed to link Discord!",
    successRedirect: "/user/settings",
    successFlash: "Successfully linked Discord account!"
}));

module.exports = router;