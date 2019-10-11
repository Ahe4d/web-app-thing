const postUser = require("./users.post.action");
const getUser = require("./users.get.action");

module.exports = {
  path: "users", // rename the path of the route (optional)
  '/': {
    post: {
      action: postUser.register,
      level: 'public'
    },
    get: {
      action: getUser.getAll,
      level: 'public'
    }
  },
  '/:id': {
    get: {
      action: getUser.getOne,
      level: 'public'
    }
  }
};