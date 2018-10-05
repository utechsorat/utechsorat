const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// result schema
const ResultSchema = new Schema({
    section: {
        type: String
    },
    factor: {
        type: String,
    },
    value: {
        type: Number,
    },
    response: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Result = module.exports = mongoose.model('Result', ResultSchema, 'results');

// add result
module.exports.addResult = function(result, callback){
    Result.create(result, callback);
}

module.exports.removeResult = function(query, callback){
    Result.findOneAndRemove(query, callback);
}

module.exports.getResults = function(callback){
    Result.find(callback);
}