var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  localStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = settings.secret;

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
        return done(null, false, { success: false, msg: 'Authentication failed.' });

      const validate = await user.comparePassword(password);
      if (!validate)
        return done(null, false, { success: false, msg: 'Authentication failed.' });

      return done(null, user, { success: true, msg: 'Authenticated successfully!' });
    } catch (error) {
      return done(error);
    }
  }));

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err)
        return done(err, false);
      if (user)
        done(null, user);
      else
        done(null, false);
    });
  })); 
};
