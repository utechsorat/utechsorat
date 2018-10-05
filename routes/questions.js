const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const Factor = require('../models/Factor');


router.get('/', (req, res, next) => {
    Question.getQuestions((err, questions) => {
        if (err) {
            res.send(err);
        }
        res.render('admin/manage_questions', {
            title: 'Manage Questions',
            questions: questions
        });
    });
});

router.get('/add', (req, res, next) => {
    res.render('admin/add_question', {title: 'Add Question'});
});

router.get('/edit/:id', (req, res, next) => {
    Question.getQuestionById(req.params.id, (err, question) => {
        if (err) {
            res.send(err)
        }
        Factor.getFactors((err, factors) => {
            res.render('admin/edit_question', {
                title: 'Edit Question',
                question: question,
                factors: factors
            });
        });
    });
});



router.get('/show/:id', (req, res, next) => {
    res.render('manage/question', {title: 'Question'});
});



router.get('/factor/:question_id', (req, res, next) => {
    res.render('manage/questions', {title: 'Factor Questions'});
});

router.post('/add', (req, res, next) => {
    let question = new Question();
    question.section = req.body.section;
    question.factor = req.body.factor;
    question.text = req.body.text;
    const options = [
        {
            text: req.body.option1,
            value: 1
        },
        {
            text: req.body.option2,
            value: 2
        },
        {
            text: req.body.option3,
            value: 3
        },
        {
            text: req.body.option4,
            value: 4
        },
        {
            text: req.body.option5,
            value: 5
        },
    ]
    question.answers = options

    Question.addQuestion(question, (err, factor) => {
        if(err) {
            res.send(err);
        }
        res.redirect('/manage/questions');
    })
});

router.post('/individual-attributes/add', (req, res, next) => {
    let question = new Question();
    question.section = 'Individual Attributes';
    question.factor = req.body.factor;
    question.text = req.body.text;
    const options = [
        {
            text: req.body.option1,
            value: 1
        },
        {
            text: req.body.option2,
            value: 2
        },
        {
            text: req.body.option3,
            value: 3
        },
        {
            text: req.body.option4,
            value: 4
        },
        {
            text: req.body.option5,
            value: 5
        },
    ]
    question.answers = options

    Question.addQuestion(question, (err, factor) => {
        if(err) {
            res.send(err);
        }
        const query = {title: req.body.factor};
        const update = {$inc: { highestScore: 5, questionCount: 1 }};
        Factor.updateFactor(query, update, {}, (err, factor) => {
            if(err) {
                res.send(err);
            } 
        })
        res.redirect('/manage/questions');
    });
});

router.post('/life-factors/add', (req, res, next) => {
    let question = new Question();
    question.section = 'Life Factors';
    question.factor = req.body.factor;
    question.text = req.body.text;
    const options = [
        {
            text: req.body.option1,
            value: 1
        },
        {
            text: req.body.option2,
            value: 2
        },
        {
            text: req.body.option3,
            value: 3
        },
        {
            text: req.body.option4,
            value: 4
        },
        {
            text: req.body.option5,
            value: 5
        },
    ]
    question.answers = options

    Question.addQuestion(question, (err, factor) => {
        if(err) {
            res.send(err);
        }
        const query = {title: req.body.factor};
        const update = {$inc: { highestScore: 5, questionCount: 1 }};
        Factor.updateFactor(query, update, {}, (err, factor) => {
            if(err) {
                res.send(err);
            } 
        })
        res.redirect('/manage/questions');
    });
});

router.post('/technical-knowledge/add', (req, res, next) => {
    let question = new Question();
    question.section = 'Technical Knowledge';
    question.factor = req.body.factor;
    question.text = req.body.text;
    const options = [
        {
            text: req.body.option1,
            value: 1
        },
        {
            text: req.body.option2,
            value: 2
        },
        {
            text: req.body.option3,
            value: 3
        },
        {
            text: req.body.option4,
            value: 4
        },
    ]
    question.answers = options

    Question.addQuestion(question, (err, factor) => {
        if(err) {
            res.send(err);
        }
        const query = {title: req.body.factor};
        const update = {$inc: { highestScore: 4, questionCount: 1 }};
        Factor.updateFactor(query, update, {}, (err, factor) => {
            if(err) {
                res.send(err);
            } 
        })
        res.redirect('/manage/questions');
    });
});

router.post('/edit/:id', (req, res, next) => {
    letquestion = new Question();
    const options = [
        {
            text: req.body.option1,
            value: 1
        },
        {
            text: req.body.option2,
            value: 2
        },
        {
            text: req.body.option3,
            value: 3
        },
        {
            text: req.body.option4,
            value: 4
        },
        {
            text: req.body.option5,
            value: 5
        },
    ]
    const query = {_id: req.params.id}
    const update = {section: req.body.section, factor: req.body.factor, text: req.body.text, answers: options}

    Question.updateQuestion(query, update, {}, (err, factor) => {
        if(err) {
            res.send(err);
        }
        res.redirect('/manage/questions');
    })
})

module.exports = router;