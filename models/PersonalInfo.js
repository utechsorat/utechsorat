const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonalInfoSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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
    disability: {
        type: String
    },
    utechStudent: {
        type: Boolean
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const PersonalInfo = module.exports = mongoose.model('PersonalInfo', PersonalInfoSchema);
