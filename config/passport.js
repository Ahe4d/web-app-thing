var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  localStrategy = require('passport-local').Strategy,
  DiscordStrategy = require('@oauth-everything/passport-discord').Strategy,
  DiscordScope = require('@oauth-everything/passport-discord').Scope;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = function(passport) {
  var opts = {};
  var token = req => req.cookies.token
  opts.jwtFromRequest = token;  
  opts.secretOrKey = settings.secret;

  // hack it if you'd like, this application is for testing anyway
  opts.discord = {};
  opts.discord.clientID = "651839563182112779";
  opts.discord.clientSecret = "ccbkBtHABEmULMoySjmnNSGprOunMMMa";
  opts.discord.callbackURL = "localhost:3000/api/auth/discord/callback";
  opts.discord.scope = [DiscordScope.IDENTIFY, DiscordScope.EMAIL];

  passport.use('register', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    emailField: 'email',
    passReqToCallback: true
  }, async (req, username, password, email, done) => {
      try {
        const user = await User.create({ username, password, email });
        return done(null, user);
      } catch (error) {
        done(error);
      }
  }));

  passport.use('login', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    try {

      if (req.user)
        return done(null, false, { success: false, msg: 'Already logged in.' });
      
      const user = await User.findOne({ username });
      if (!user)
        return done(null, false, { success: false, msg: 'Authentication failed.' });

      const validate = await user.comparePassword(password);
      if (!validate)
        return done(null, false, { success: false, msg: 'Authentication failed.' });

      return done(null, user, { success: true, msg: 'Authenticated successfully!' });
    } catch (error) {
      return done(error);
    }
  }));

  passport.use(new JwtStrategy(Object.assign(opts, {passReqToCallback: true}), async (req, token, done) => {
    console.log("user wants to authorize...")
    try {
      //Pass the user details to the next middleware
      console.log(token.user.username, "authorized towards route", req.originalUrl)
      req.user = token.user
      return done(null, token.user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use(new DiscordStrategy(opts.discord, async (accessToken, refreshToken, profile, cb) => {
    // `profile` will be the user's Discord profile
    console.log(profile);
 
    // You should use that to create or update their info in your database/etc and then return the user using `cb`
    cb(null, /* database.createOrUpdateDiscordUser(profile) */)
  }));
 
};
