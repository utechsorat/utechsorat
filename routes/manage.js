const express = require('express');
const router = express.Router();

const Factor = require('../models/Factor');
const Question = require('../models/Question');

// manage questions routes 

router.get('/questions', (req, res, next) => {
    Question.getQuestions((err, questions) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/manage_questions', {
            title: 'Manage Questions',
            questions: questions
        });
    });
});

router.get('/questions/add', (req, res, next) => {
    Factor.getFactors((err, factors) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/add_question', {
            title: 'Add Question',
            factors: factors
        });
    });
});

router.get('/questions/individual-attributes/add', (req, res, next) => {
    const query = {section: 'Individual Attributes'};
    Factor.getFactorBySection(query, (err, factors) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/add_individual-attribute_question', {
            title: 'Add Individual Attribute Question',
            factors: factors
        });
    });
});

router.get('/questions/life-factors/add', (req, res, next) => {
    const query = {section: 'Life Factors'};
    Factor.getFactorBySection(query, (err, factors) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/add_life-factor_question', {
            title: 'Add Life Factor Question',
            factors: factors
        });
    });
});

router.get('/questions/technical-knowledge/add', (req, res, next) => {
    const query = {section: 'Technical Knowledge'};
    Factor.getFactorBySection(query, (err, factors) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/add_technical-knowledge_question', {
            title: 'Add Technical Knowledge Question',
            factors: factors
        });
    });
});


router.get('/questions/edit/:id', (req, res, next) => {
    Question.getQuestionById(req.params.id, (err, question) => {
        if (err) {
            res.send(err)
        }
        Factor.getFactors((err, factors) => {
            res.render('manage/edit_question', {
                title: 'Edit Question',
                question: question,
                factors: factors
            });
        });
    });
});


router.get('/factors', (req, res, next) => {
    Factor.getFactors((err, factors) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/manage_factors', {
            title: 'Manage Factors',
            factors: factors
        });
    });
});


router.get('/factors/add', (req, res, next) => {
    res.render('manage/add_factor', { title: 'Add Factor' });
});


router.get('/factors/edit/:id', (req, res, next) => {
    Factor.getFactorById(req.params.id, (err, factor) => {
        if (err) {
            res.send(err)
        }
        res.render('manage/edit_factor', {
            title: 'Edit Factor',
            factor: factor
        });
    });
});


module.exports = router;