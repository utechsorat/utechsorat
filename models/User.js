const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user schema
const UserSchema = new Schema({
  firstname:{
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
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

const User = module.exports = mongoose.model('User', UserSchema);

// update section
module.exports.updateSection = function(query, update, options, callback){
  User.findOneAndUpdate(query, update, options, callback);
}

// get single factor by id
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
// get all users
module.exports.getUsers = function(query, callback){
  User.find(query, callback);
}

module.exports.getUsers = function(callback){
  User.find(callback).sort([['email', 'ascending']]);
}