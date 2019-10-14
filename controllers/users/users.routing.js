var passport = require('passport');
require('../../config/passport')(passport);

const postUser = require('./users-post.action');
const getUser = require('./users-get.action');

module.exports = {
  '/': {
    post: {
      action: postUser.register,
      level: 'public'
    },
    get: {
      action: getUser.getAll,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  },
  '/:id': {
    get: {
      action: getUser.getOne,
      level: 'public',
      middlewares: [passport.authenticate('jwt', { session: false})]
    }
  }
};