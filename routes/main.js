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
  .get(isLoggedInInv, function (req, res, next) {
    console.log(req)
    return res.render('pages/login', { title: 'Login'});
  })
  .post(passport.authenticate('login', 
  {
    failWithError: true, 
    failureRedirect: '/login', 
    failureFlash: "There was an error logging you in!",
    successRedirect: '/',
    successFlash: "Successfully logged in!"
  }))

/* Register */
router.route('/register')
  .get(isLoggedInInv, function (req, res, next) {
    console.log(req)
    return res.render('pages/register', { title: 'Register'});
  })
  .post(function (req, res) {
    console.log("Posting...")
    axios.post(req.protocol + "://" + req.get('host') + '/api/auth/register', {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then((response) => {
      console.log(response)
      if (response.data.success) {
        res.cookie('token', response.data.token)
        req.flash('success', "Successfully registered! Welcome to the service!")
        return res.redirect('/')
      }
    }, (error) => {
      console.log(error);
      req.flash('danger', 'There was an error while registering your account!')
      return res.redirect('/register')
    });
  })

router.get('/logout', function (req, res, next) {
  req.logOut()
  req.flash('success', 'Logged out!');
  return res.redirect('back') 
})

router.get('/test', function (req, res, done) {
  if (!req.isAuthenticated()) return res.json([req.user, req.session])
  else return res.send('you are auth lol')
})

router.get('/test2', isLoggedIn, function (req, res, done) {
  return res.send('hey')
})

function isLoggedInInv(req, res, next) {
  if (!req.user) {
    return next();
  } else
    req.flash('error', 'You are already logged in!');
    return res.redirect("/") 
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else
    req.flash('error', 'You are not logged in!');
    console.log('user isnt logged in')
    return res.redirect("/") 
}

module.exports = router;
