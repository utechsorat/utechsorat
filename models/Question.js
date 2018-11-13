const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// question schema
const QuestionSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
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

