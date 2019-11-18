var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var lumie = require('lumie');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./config/mongogui');
var fetch = require('node-fetch');

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/web-app-thing', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mongo_express', mongo_express(mongo_express_config))
lumie.load(app, {
  preURL: "api",
  verbose: true,
  ignore: ["*.spec", "*.action"],
  controllers_path: path.join(__dirname, "controllers")
});

app.get('/', function (req, res, next) {
  res.render('index.ejs', { title: "web-app-thing", user: req.user })
});

app.get('/login', function (req, res, next) {
  return res.render('login.ejs', { title: "web-app-thing" })
});

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