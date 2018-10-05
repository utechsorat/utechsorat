const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// personal info schema
const PersonalInfoSchema = new Schema({
    gender: {
        type: String
    },
    age: {
        type: String,
    },
    nationality: {
        type: String,
    },
    residence: {
        type: String,
    },
    faculty: {
        type: String,
    },
    interest: {
        type: String,
    },
    disability:{
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const PersonalInfo = module.exports = mongoose.model('PersonalInfo', PersonalInfoSchema, 'personalInfo');

// add result
module.exports.addPersonalInfo = function(personalInfo, callback){
    PersonalInfo.create(personalInfo, callback);
}

module.exports.removePersonalInfo = function(query, callback){
    PersonalInfo.findOneAndRemove(query, callback);
}

module.exports.getPersonalInfo = function(callback){
    PersonalInfo.find(callback);
}