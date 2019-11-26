var passport = require('passport');
require('../../config/passport')(passport);

const postUser = require('./users-post.action');
const getUser = require('./users-get.action');

module.exports = {
  '/register': {
    post: {
      action: postUser.register,
      level: 'public',
      middlewares: [passport.authenticate('register', { session: false })]
    }
  },
  '/login': {
    post: {
      action: postUser.login,
      level: 'public',
      middlewares: [passport.authenticate('login', { session: false })]
    }
  },
  '/get/all': {
    get: {
      action: getUser.getAll,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false })]
    }
  },
  '/get/:id': {
    get: {
      action: getUser.getOne,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  },
  '/delete': {
    post: {
      action: postUser.delete,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  }
};