var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/* GET users listing. */
router.route('/login')
  .get(function(req, res, next) {
    return res.render('login', { title: 'web-app-thing' });
  })

module.exports = router;
