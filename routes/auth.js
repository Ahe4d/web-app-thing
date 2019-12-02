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
    console.log(req)
    return res.render('pages/login', { title: 'Login'});
  })
  .post(function (req, res) {
    console.log("Posting...")
    axios.post('http://localhost:3000/api/auth/login', {
      username: req.body.username,
      password: req.body.password
    })
    .then((response) => {
      console.log(response)
      if (response.data.success) {
        res.cookie('token', response.data.token)
        res.flash('success', response.data.msg)
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
      if (response.data.success) {
        res.flash('success', response.data.msg)
        return res.redirect('/')
      }
    }, (error) => {
      console.log(error);
      res.flash('danger', 'There was an error while registering your account!')
      return res.redirect('/register')
    });
  })

function isLoggedIn(req, res, next) {
  if (req.token) {
     res.flash("You are already logged in!", "danger");
     return res.redirect("/") 
  } else
    next();
}

module.exports = router;
