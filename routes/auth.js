var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);

/* Index */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'web-app-thing', user: req.user })
})

/* Login */
router.route('/login')
  .get(function (req, res, next) {
    return res.render('login', { title: 'web-app-thing' });
  })
  .post(function (req, res) {
    axios.post('http://localhost:3000/api/auth/login', {
      username: req.body.username,
      password: req.body.password
    })
    .then((response) => {
      if (response.success) {
        res.flash("success", response.msg)
        return res.redirect('/')
      }
    }, (error) => {
      console.log(error);
      res.flash("danger", response.msg)
      return res.redirect('/login')
    });
  })

module.exports = router;
