var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('./logs/logger')
var bodyParser = require('body-parser');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./config/mongogui');

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/web-app-thing', { useNewUrlParser: true, useUnifiedTopology: true, promiseLibrary: require('bluebird') })
  .then(() =>  logger.dbLogger.info('Connection successful!'))
  .catch((err) => logger.dbLogger.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mongo_express', mongo_express(mongo_express_config))

// app.get('/', function (req, res, next) {
//   res.render('index.ejs', { title: "web-app-thing", user: req.user })
// });

/* Controllers */
try {
  app.use('/api/auth/login', require('./controllers/auth/login'))
  app.use('/api/auth/register', require('./controllers/auth/register'))
  logger.appLogger.info("Loaded controllers!")
} catch (err) {
  logger.appLogger.error(err)
}

try {
  app.use('/', require('./routes/users'))
} catch (err) {
  console.log("Error!\n" + err)
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
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