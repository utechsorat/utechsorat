const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// answer schema
const AnswerSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
    },
    value: {
        type: Number,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

const User = module.exports = mongoose.model('Answer', AnswerSchema, 'answers');