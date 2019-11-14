var passport = require('passport');
require('../../config/passport')(passport);

const postUser = require('./users-post.action');
const getUser = require('./users-get.action');

module.exports = {
  '/register': {
    post: {
      action: postUser.register,
      level: 'public'
    }
  },
  '/login': {
    post: {
      action: postUser.login,
      level: 'public'
    }
  },
  '/get/all': {
    get: {
      action: getUser.getAll,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  },
  '/get/:id': {
    get: {
      action: getUser.getOne,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  }
};