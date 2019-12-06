var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  localStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = function(passport) {
  var opts = {};
  var token = req => req.cookies.token
  opts.jwtFromRequest = token;
  if (typeof token == "undefined")
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT')
  
  opts.secretOrKey = settings.secret;

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

  passport.use(new JwtStrategy(opts, async (token, done) => {
    console.log("user wants to authorize...")
    try {
      //Pass the user details to the next middleware
      console.log(token.user.username, "authorized towards route")
      return done(null, token.user);
    } catch (error) {
      return done(error);
    }
  }));
};
