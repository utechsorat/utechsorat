const express = require('express');
const router = express.Router();

const Factor = require('../models/Factor');
const Question = require('../models/Question');

router.get('/', (req, res) => {
    Factor.getFactors((err, factors) => {
        if(err){
            res.send(err);
        }
        res.render('admin/manage_factors', {
            title:'Manage Factors',
            factors: factors
        });
    }); 
});

router.get('/add', (req, res, next) => {
    res.render('admin/add_factor', { title: 'Add Factor' });
});

router.get('/edit/:id', (req, res, next) => {
    Factor.getFactorById(req.params.id, (err, factor) => {
        if (err) {
            res.send(err)
        }
        res.render('admin/edit_factor', {
            title: 'Edit Factor',
            factor: factor
        });
    });
});

router.post('/add', (req, res, next) => {
    let factor = new Factor();
    factor.title = req.body.title;
    factor.section = req.body.section;
    factor.lowresponse = req.body.lowresponse;
    factor.mediumresponse = req.body.mediumresponse;
    factor.highresponse = req.body.highresponse;

    Factor.addFactor(factor, (err, factor) => {
        if(err) {
            res.send(err);
        }
        res.redirect('/factors');
    })
})


router.post('/edit/:id', (req, res, next) => {
    let factor = new Factor();
    const query = {_id: req.params.id}
    const update = {title: req.body.title, section: req.body.section, description: req.body.description}

    Factor.updateFactor(query, update, {}, (err, factor) => {
        if(err) {
            res.send(err);
        }
        res.redirect('/manage/factors');
    })
})

router.delete('/delete/:id', (req, res, next) => {
    
    const query = {_id: req.params.id}
    
    Factor.removeFactor(query, (err, factor) => {
        if(err) {
            res.send(err);
        }
        res.status(200);
    })
})

module.exports = router;