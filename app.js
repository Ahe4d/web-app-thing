var createError = require('http-errors');
var express = require('express');
var path = require('path'); 
var logger = require('./logs/logger')
var bodyParser = require('body-parser');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./config/mongogui');
var settings = require('./config/settings');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/web-app-thing', { useNewUrlParser: true, useUnifiedTopology: true, promiseLibrary: require('bluebird') })
  .then(() =>  logger.dbLogger.info('Connection successful!'))
  .catch((err) => logger.dbLogger.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(cookieParser(settings.cookieSecret));
app.use(session({
  key: settings.cookieKey,
  secret: settings.cookieSecret,
  resave: true,
  saveUninitialized: false,
  cookie : { httpOnly: true, secure : false, maxAge : (4 * 60 * 60 * 1000)}
}));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.flash = req.flash;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/mongo_express', mongo_express(mongo_express_config))

app.locals = {
  site: {
    title: "web-app-thing",
    description: "Testing",
    version: "0.1.0-alpha",
    baseurl: "changeme"
  },
  author: {
    name: "Your Name Here",
    copyright: "2019"
  }
}

const flashMessageMiddleware = require('./middleware/flashMessage');
app.use(flashMessageMiddleware.flashMessage);

/* Controllers */
try {
  app.use('/api/auth', require('./controllers/auth/login'))
  app.use('/api/auth', require('./controllers/auth/register'))
  app.use('/api/auth', require('./controllers/auth/logout'))
  app.use('/api/auth', require('./controllers/auth/discord'))
  logger.appLogger.info("Loaded controllers!")
} catch (err) {
  console.log(err)
  logger.appLogger.error("Error while loading controllers!\n", err)
}

/* Routes */
try {
  app.use('/', require('./routes/main'))
  app.use('/user', require('./routes/user'))
  logger.appLogger.info("Loaded routes!")
} catch (err) {
  logger.appLogger.error("Error while loading routes!\n", err)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url)
  var err = new Error('Not Found');
  err.status = 404;
  res.status(err.status || 404).render('errors/404', { title: "Page Unavailable", user: req.user });
  next(err);
});

// restful api error handler
app.use(function(err, req, res, next) {
  console.log(err);

  /*if (process.env.WEBENV !== 'development') {
      delete err.stack;
  }*/

  res.status(err.statusCode || 500).render('errors/500', { title: "Internal Server Error", user: req.user, err: err});
  next(err);
});

module.exports = app;