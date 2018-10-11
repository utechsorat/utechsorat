const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {
  ensureAuthenticated
} = require("../helpers/auth");

// user model
const User = require("../models/User");
const Factor = require("../models/Factor");
const Question = require("../models/Question")

// dashboard get route
router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", {
    dashboard: true
  });
});

// users get route
router.get("/users/:page", (req, res, next) => {

  if (req.query.search) {
    const perPage = 5;
    const page = req.params.page || 1;
    const query = {
      lastname: req.query.search
    } || {};
    User.find(query)
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, users) {
        User.countDocuments(query).exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }
          res.render("admin/users", {
            usersActive: true,
            users: users,
            current: Number(page),
            pages: pageArray,
            query: req.query.search
          });
        });
      });

  } else {
    const perPage = 5;
    const page = req.params.page || 1;
    User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, users) {
        User.countDocuments().exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }
          res.render("admin/users", {
            usersActive: true,
            users: users,
            current: Number(page),
            pages: pageArray
          });
        });
      });

  }
});

// users delete route
router.delete('/users/delete/:id', (req, res) => {
  User.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('back');
    });
});

// users priviledge put route
router.put('/users/edit/:id', (req, res) => {
  User.findOne({
      _id: req.params.id
    })
    .then(user => {
      user.admin = !user.admin;

      user.save()
        .then(user => {
          res.redirect('back');
        });
    });
});








// factors get route
router.get("/factors/:page", (req, res, next) => {

  if (req.query.search) {
    const perPage = 5;
    const page = req.params.page || 1;
    const query = {
      title: req.query.search
    } || {};
    Factor.find(query)
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, factors) {
        Factor.countDocuments(query).exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }
          res.render("admin/factors", {
            factorsActive: true,
            factors: factors,
            current: Number(page),
            pages: pageArray,
            query: req.query.search
          });
        });
      });

  } else {
    const perPage = 5;
    const page = req.params.page || 1;
    Factor.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, factors) {
        Factor.countDocuments().exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }
          res.render("admin/factors", {
            factorsActive: true,
            factors: factors,
            current: Number(page),
            pages: pageArray
          });
        });
      });
  }
});

// add factor get route
router.get('/factor/add', (req, res) => {
  res.render("admin/add-factor", {
    factorsActive: true
  });
});

// add factor post route
router.post('/factor/add', (req, res) => {
  let factor = new Factor();
  factor.title = req.body.title;
  factor.section = req.body.section;
  factor.lowResponse = req.body.lowresponse;
  factor.mediumResponse = req.body.mediumresponse;
  factor.highResponse = req.body.highresponse;

  factor.save()
    .then(factor => {
      res.redirect('/admin/factors/1');
    });
})

// edit factor get route
router.get('/factor/edit/:id', (req, res) => {
  Factor.findOne({
      _id: req.params.id
    })
    .then(factor => {
      res.render("admin/edit-factor", {
        factorsActive: true,
        factor: factor
      });
    });
});

// edit factor put route
router.put('/factor/edit/:id', (req, res) => {
  Factor.findOne({
      _id: req.params.id
    })
    .then(factor => {
      factor.title = req.body.title;
      factor.section = req.body.section;
      factor.lowResponse = req.body.lowresponse;
      factor.mediumResponse = req.body.mediumresponse;
      factor.highResponse = req.body.highresponse;

      factor.save()
        .then(factor => {
          res.redirect('/admin/factors/1');
        })
    })
})

// factor delete route
router.delete('/factors/delete/:id', (req, res) => {
  const id = req.params.id;

  Factor.findOne({
    _id: id
  }, function (err, factor) {
    factor.remove()
      .then(() => {
        res.redirect('back');
      });
  });
});











// questions get route
router.get("/questions/:page", (req, res, next) => {

  if (req.query.search) {
    const perPage = 5;
    const page = req.params.page || 1;
    const query = {
      title: req.query.search
    } || {};
    Question.find(query)
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate('factor')
      .exec(function (err, questions) {
        Question.countDocuments(query).exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }

          res.render("admin/factors", {
            questionsActive: true,
            questions: questions,
            current: Number(page),
            pages: pageArray,
            query: req.query.search
          });
        });
      });

  } else {
    const perPage = 5;
    const page = req.params.page || 1;
    Question.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate('factor', 'title')
      .exec(function (err, questions) {
        Question.countDocuments().exec(function (err, count) {
          if (err) {
            return next(err)
          }
          const pageArray = [];
          for (var i = 1; i <= Math.ceil(count / perPage); i++) {
            pageArray.push(i);
          }

          res.render("admin/questions", {
            questionsActive: true,
            questions: questions,
            current: Number(page),
            pages: pageArray
          });
        });
      });
  }
});

// add question get route
router.get('/question/add', (req, res) => {
  Factor.find({})
    .then(factors => {
      res.render("admin/add-question", {
        questionsActive: true,
        factors: factors
      });
    });
});

// add question post route
router.post('/question/add', (req, res) => {
  let maxValue = 2;
  Factor.findOne({
      title: req.body.factor
    })
    .then(factor => {
      let question = new Question();
      question.text = req.body.text;
      question.factor = factor._id;
      question.section = factor.section;
      
      const options = [{
          name: "Opt1",
          text: req.body.Opt1,
          value: 1
        },
        {
          name: "Opt2",
          text: req.body.Opt2,
          value: 2
        }];

      if (req.body.Opt3){
        options.push( {
          name: "Opt3",
          text: req.body.Opt3,
          value: 3
        });
        maxValue = 3;
      }

      if (req.body.Opt4){
        options.push( {
          name: "Opt4",
          text: req.body.Opt4,
          value: 4
        });
        maxValue = 4;
      }

      if (req.body.Opt5){
        options.push( {
          name: "Opt5",
          text: req.body.Opt5,
          value: 5
        });
        maxValue = 5;
      }
      
      question.answers = options;
      question.maxValue = maxValue;



      question.save()
        .then(question => {
          factor.highestScore = factor.highestScore + maxValue;
          factor.questionCount = factor.questionCount + 1;
          factor.save()
            .then(() => {
              res.redirect('/admin/questions/1');
            });
        });
    });
});

// edit question get route
router.get('/question/edit/:id', (req, res) => {
  Question.findOne({
      _id: req.params.id
    })
    .populate('factor', 'title')
    .then(question => {
      Factor.find({})
        .then(factors => {
          res.render("admin/edit-question", {
            questionsActive: true,
            question: question,
            factors: factors
          });
        });
    });
});

// edit question put route
router.put('/question/edit/:id', (req, res) => {
  let maxValue = 2;
  Question.findOne({
      _id: req.params.id
    })
    .then(question => {
      Factor.findOne({
          title: req.body.factor
        })
        .then(factor => {
          question.text = req.body.text;
          question.factor = factor._id;
          question.section = factor.section;
          const options = [{
            name: "Opt1",
            text: req.body.Opt1,
            value: 1
          },
          {
            name: "Opt2",
            text: req.body.Opt2,
            value: 2
          }];
  
        if (req.body.Opt3){
          options.push( {
            name: "Opt3",
            text: req.body.Opt3,
            value: 3
          });
          maxValue = 3;
        }
  
        if (req.body.Opt4){
          options.push( {
            name: "Opt4",
            text: req.body.Opt4,
            value: 4
          });
          maxValue = 4;
        }
  
        if (req.body.Opt5){
          options.push( {
            name: "Opt5",
            text: req.body.Opt5,
            value: 4
          });
          maxValue = 5;
        }
        
        question.answers = options
        question.maxValue = maxValue;
  


          question.save()
            .then(question => {
              res.redirect('/admin/questions/1');
            });
        });
    });
});

// factor delete route
router.delete('/questions/delete/:id', (req, res) => {
  const id = req.params.id;

  Question.findOne({
    _id: id
  }, function (err, question) {
    question.remove()
      .then(() => {
        Factor.findOne({
            _id: question.factor
          })
          .then((factor) => {
            factor.questionCount = factor.questionCount - 1;
            factor.highestScore = factor.highestScore - question.maxValue;
            factor.save()
              .then(() => {
                res.redirect('back');
              })
          })

      });
  });
});











// admin previews route
router.get("/preview", (req, res) => {
  res.render("admin/preview", {
    preview: true
  });
});

// admin results route
router.get("/results", (req, res) => {
  res.render("admin/results", {
    results: true
  });
});

// admin settings route
router.get("/settings", (req, res) => {
  res.render("admin/settings", {
    setting: true
  });
});

// admin settings route
router.get("/documentation", (req, res) => {
  res.render("admin/documentation", {
    documentation: true
  });
});



router.get("/*", (req, res, next) => {
  res.redirect("/");
});


module.exports = router;