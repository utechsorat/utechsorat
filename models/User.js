const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonalInfo = require('../models/PersonalInfo');
const Result = require('../models/Result');
// user schema
const UserSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  section: {
    type: String,
    default: 'personal-information'
  },
  admin: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre('remove', function (next) {
  Result.deleteMany({
    user: this._id
  }).exec().then(() => {
      PersonalInfo.deleteMany({
        user: this._id
      }).exec();
    }
  );
  next();
});



const User = module.exports = mongoose.model('User', UserSchema);

// update section
module.exports.updateSection = function (query, update, options, callback) {
  User.findOneAndUpdate(query, update, options, callback);
}

// get single factor by id
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}
// get all users
module.exports.getUsers = function (query, callback) {
  User.find(query, callback);
}

module.exports.getUsers = function (callback) {
  User.find(callback).sort([
    ['email', 'ascending']
  ]);
}