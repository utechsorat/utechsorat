const mongoose = require('mongoose');
const Question = require('./Question');
const Schema = mongoose.Schema;

// factor schema
const FactorSchema = new Schema({
    title: {
        type: String
    },
    section: {
        type: String,
    },
    highestScore:{
        type: Number,
        default: 0
    },
    lowResponse:{
        type: String
    },
    mediumResponse:{
        type: String
    },
    highResponse:{
        type: String
    },
    questionCount:{
        type: Number,
        default: 0
    },
    score:{
        type: Number,
        default: 0
    }
});


FactorSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Question.deleteMany({factor: this._id}).exec();
    next();
});

const Factor = module.exports = mongoose.model('Factor', FactorSchema, 'factors');

// get factors
module.exports.getFactors = function(callback, limit){
    Factor.find(callback).limit(limit).sort([['title', 'ascending']]);
}

// add factors
module.exports.addFactor = function(factor, callback){
    Factor.create(factor, callback);
}

// get single factor by id
module.exports.getFactorById = function(id, callback){
    Factor.findById(id, callback);
}

// get single factor by section
module.exports.getFactorBySection = function(query, callback){
    Factor.find(query, callback);
}

// update factor
module.exports.updateFactor = function(query, update, options, callback){
    Factor.findOneAndUpdate(query, update, options, callback);
}

// delete factor
module.exports.removeFactor = function(query, callback){
    Factor.remove(query, callback);
}