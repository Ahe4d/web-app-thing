var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var localStrategy = require('passport-local').Strategy;
var DiscordStrategy = require('@oauth-everything/passport-discord').Strategy;
var DiscordScope = require('@oauth-everything/passport-discord').Scope;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = (passport) => {
  var opts = {};
  var token = req => req.cookies.token
  opts.jwtFromRequest = token;  
  opts.secretOrKey = settings.secret;

  // hack it if you'd like, this application is for testing anyway
  opts.discord = {};
  opts.discord.clientID = "651839563182112779";
  opts.discord.clientSecret = "ccbkBtHABEmULMoySjmnNSGprOunMMMa";
  opts.discord.callbackURL = "http://localhost:3000/api/auth/discord/callback";
  opts.discord.scope = [DiscordScope.IDENTIFY, DiscordScope.EMAIL];

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('register', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    emailField: 'email'
  }, async (username, password, email, done) => {
      try {
        const user = await User.create({ username, password, email });
        return done(null, user);
      } catch (error) {
        done(error);
      }
  }));

  passport.use('login', new localStrategy({
    usernameField : 'username',
    passwordField : 'password'
  }, async (username, password, done) => {
    try {      
      const user = await User.findOne({ username });
      if (!user)
        return done(null, false);

      const validate = await user.comparePassword(password);
      if (!validate)
        return done(null, false);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('jwt', new JwtStrategy(opts, async (token, done) => {
    try {
      //Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('discord', new DiscordStrategy(Object.assign(opts.discord, {passReqToCallback: true}), async (req, accessToken, refreshToken, profile, done) => {
    // `profile` will be the user's Discord profile
    console.log(profile);
    console.log(req.user)
    
    const user = await User.findOne({ username: req.user.username });

    const discordauth = await user.associateDiscord(profile)
    // You should use that to create or update their info in your database/etc and then return the user using `done`
    done(null, user)
  }));

};
