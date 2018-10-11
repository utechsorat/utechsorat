const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// question schema
const QuestionSchema = new Schema({
    section: {
        type: String,
        required: true
    },
    factor: {
        type: Schema.Types.ObjectId,
        ref: 'Factor'
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    maxValue: {
        type: Number,
        default: 0
    },
    answers: [{
        name: {
            type: String,

        },
        text: {
            type: String,

        },
        value: {
            type: Number,

        }
    }],

});



const Question = module.exports = mongoose.model('Question', QuestionSchema, 'questions');

// get questions
module.exports.getQuestions = function (callback, limit) {
    Question.find(callback).limit(limit).sort([
        ['title', 'ascending']
    ]);
}

// add question
module.exports.addQuestion = function (factor, callback) {
    Question.create(factor, callback);
}

// get single factor by id
module.exports.getQuestionById = function (id, callback) {
    Question.findById(id, callback);
}

// update factor
module.exports.updateQuestion = function (query, update, options, callback) {
    Question.findOneAndUpdate(query, update, options, callback);
}

// delete factor
module.exports.removeQuestion = function (query, callback) {
    Question.remove(query, callback);
}