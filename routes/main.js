var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);

/* Index */
router.get('/', function (req, res, next) {
  return res.render('pages/index', { title: 'Home', user: req.user })
})

/* Login */
router.route('/login')
  .get(isLoggedIn, function (req, res, next) {
    return res.render('pages/login', { title: 'Login'});
  })
  .post(function (req, res) {
    console.log("Posting...")
    axios.post(req.hostname + '/api/auth/login', {
      username: req.body.username,
      password: req.body.password
    })
    .then((response) => {
      if (response.data.success) {
        res.cookie('token', response.data.token)
        res.flash('success', "Successfully logged in!")
        return res.redirect('/')
      }
    }, (error) => {
      console.log(error);
      res.flash('danger', 'There was an error logging you in!')
      return res.redirect('/login')
    });
  })

/* Register */
router.route('/register')
  .get(isLoggedIn, function (req, res, next) {
    console.log(req)
    return res.render('pages/register', { title: 'Register'});
  })
  .post(function (req, res) {
    console.log("Posting...")
    axios.post('http://localhost:3000/api/auth/register', {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then((response) => {
      console.log(response)
      if (response.token) {
        console.log(response.token)
        res.flash('success', "Successfully registered! Welcome to the service!")
        return res.redirect('/')
      }
    }, (error) => {
      console.log(error);
      res.flash('danger', 'There was an error while registering your account!')
      return res.redirect('/register')
    });
  })

router.get('/logout', function (req, res, next) {
  if (!req.cookies.token) {
    res.flash('danger', 'You are not logged in!');
    return res.redirect('back')
  }
  
  res.clearCookie('token');
  res.flash('success', 'Successfully logged out!');
  return res.redirect('/')
})

router.get('/test', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), function (req, res, done) {
  if (req.user)
    return res.json({success: true})
})

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    return next();
  } else
    res.flash('danger', 'You are already logged in!');
    return res.redirect("/") 
}

module.exports = router;
