var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    default: 0
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  rank: {
    type: String,
    required: true,
    default: "Member"
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  console.log("saving");
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      console.log(salt + "\nwe got da password");
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        console.log(hash + "\nhashed?");
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = async function (passw) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return err;
    }
    return isMatch;
  });
};

module.exports = mongoose.model('User', UserSchema);
