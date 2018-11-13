const mongoose = require('mongoose');
const Question = require('./Question');
const Schema = mongoose.Schema;

// factor schema
const FactorSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String
    },
    section: {
        type: String,
    },
    highestScore: {
        type: Number,
        default: 0
    },
    lowResponse: {
        type: String
    },
    mediumResponse: {
        type: String
    },
    highResponse: {
        type: String
    },
    questionCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    }
});


FactorSchema.pre('remove', function (next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Question.deleteMany({
        factor: this._id
    }).exec();
    next();
});

const Factor = module.exports = mongoose.model('Factor', FactorSchema, 'factors');

