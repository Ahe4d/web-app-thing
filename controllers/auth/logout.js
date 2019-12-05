var express = require('express');
var router = express.Router();

router.post('/logout', async (req, res, next) => {
  try {
    console.log("logged out token", req.cookies.token)
    res.clearCookie('token');
    res.flash('success', 'Successfully logged out!');
    res.redirect("/");
    return next(null, "Guest")
  } catch (error) {
    return next(error);
  }
});

module.exports = router;