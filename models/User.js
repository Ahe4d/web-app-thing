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
  },
  discord: {
    id: String,
    token: String,
    email: String,
    name: String
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

UserSchema.methods.comparePassword = async function (password){
  const user = this;
  console.log(user)
  //Hashes the password sent by the user for login and checks if the hashed password stored in the 
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

UserSchema.methods.getUser = async function (id) {
  const user = await mongoose.model('User')
    .findOne({id: id})
    .select('-password')
    .populate(user, '-password')
  return user;
}

UserSchema.methods.associateDiscord = async function (disc) {
  const user = this;
  user.discord = disc;
  await user.save();
  return user;
}

module.exports = mongoose.model('User', UserSchema);
