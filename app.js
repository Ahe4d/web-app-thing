var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');  
var logger = require('./logs/logger')
var bodyParser = require('body-parser');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./config/mongogui');
var flash = require('express-flash-2');
var session = require('express-session');

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/web-app-thing', { useNewUrlParser: true, useUnifiedTopology: true, promiseLibrary: require('bluebird') })
  .then(() =>  logger.dbLogger.info('Connection successful!'))
  .catch((err) => logger.dbLogger.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser('bruh'));
app.use(session({
  secret: 'bruh',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/mongo_express', mongo_express(mongo_express_config))

app.locals = {
  site: {
    title: "web-app-thing",
    description: "Testing",
    version: "0.1.0-alpha"
  },
  author: {
    name: "Your Name Here",
    copyright: "2019"
  }
}

/* Controllers */
try {
  app.use('/api/auth', require('./controllers/auth/login'))
  app.use('/api/auth', require('./controllers/auth/register'))
  logger.appLogger.info("Loaded controllers!")
} catch (err) {
  logger.appLogger.error(err)
}

try {
  app.use('/', require('./routes/auth'))
} catch (err) {
  console.log("Error!\n" + err)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url)
  var err = new Error('Not Found');
  err.status = 404;
  res.render('errors/404', { title: "Page Unavailable "});
  next(err);
});

// restful api error handler
app.use(function(err, req, res, next) {
  console.log(err);

  if (req.app.get('env') !== 'development') {
      delete err.stack;
  }

	res.status(err.statusCode || 500).json(err);
});

module.exports = app;