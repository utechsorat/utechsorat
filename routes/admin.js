const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const {
  ensureAuthenticated
} = require("../helpers/auth");
const {
  adminAuthenticated
} = require("../helpers/auth");


var passageP1 =
  'Washington DC is the capital of the United States of America. Washington takes its name from the first president of America , George Washington. The "Columbia" in "District of Columbia" stands for ............. well there are many theories to why it was named "Columbia"( I just hope it had nothing to do with Christopher Columbus because I know he did not "discover" that area of land too ). The capital of the United States is home to over 10 memorials and landmarks that commemorate some astounding events in history. These exquisitely designed landmarks attract tourists from across the globe.'


var passageP2 = "I visited Washington DC in the summer of 2014 and it was extremely hot, so if you are planning to visit stock up on bottles of water and some sunscreen. Areas near landmarks are only accessible by foot so comfortable shoes are a must. If you are adventurous like I am then you will want to visit most of the landmarks which is alot alot ALOT of walking lol, so some earphones and your favourite playlist will keep you energized and moving quickly.  What is a trip without pictures?? Selfie!!! Ensure you have a reliable camera and always have charged batteries or a powerbank."

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
router.get("/users/:page", ensureAuthenticated, adminAuthenticated, (req, res, next) => {

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
router.delete('/users/delete/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  User.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('back');
    });
});

// users priviledge put route
router.put('/users/edit/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
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
router.get("/factors/:page", ensureAuthenticated, adminAuthenticated, (req, res, next) => {

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
router.get('/factor/add', (req, res, next) => {
  res.render("admin/add-factor", {
    factorsActive: true
  });
});

// add factor post route
router.post('/factor/add', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  let factor = new Factor();
  factor._id = mongoose.Types.ObjectId(),
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
router.get('/factor/edit/:id', (req, res, next) => {
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
router.put('/factor/edit/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
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
router.delete('/factors/delete/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
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
router.get("/questions/:page", ensureAuthenticated, adminAuthenticated, (req, res, next) => {

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
router.get('/question/add', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  Factor.find({})
    .then(factors => {
      res.render("admin/add-question", {
        questionsActive: true,
        factors: factors
      });
    });
});

// add question post route
router.post('/question/add', (req, res, next) => {
  let maxValue;
  Factor.findOne({
      title: req.body.factor
    })
    .then(factor => {
      let question = new Question();
      question._id = mongoose.Types.ObjectId();
      question.text = req.body.text;
      question.factor = factor._id;
      question.section = factor.section;


      const options = [{
          name: "Opt1",
          text: req.body.Opt1,
          value: Number(req.body.Opt1Value)
        },
        {
          name: "Opt2",
          text: req.body.Opt2,
          value: Number(req.body.Opt2Value)
        }
      ];

      maxValue = Number(req.body.Opt1Value) + Number(req.body.Opt2Value);

      if (req.body.Opt3) {
        options.push({
          name: "Opt3",
          text: req.body.Opt3,
          value: Number(req.body.Opt3Value)
        });
        maxValue = maxValue + Number(req.body.Opt3Value);
      }

      if (req.body.Opt4) {
        options.push({
          name: "Opt4",
          text: req.body.Opt4,
          value: Number(req.body.Opt4Value)
        });
        maxValue = maxValue + Number(req.body.Opt4Value);
      }

      if (req.body.Opt5) {
        options.push({
          name: "Opt5",
          text: req.body.Opt5,
          value: Number(req.body.Opt5Value)
        });
        maxValue = maxValue + Number(req.body.Opt5Value);
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
router.get('/question/edit/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
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
router.put('/question/edit/:id', (req, res, next) => {
  let maxValue;
  let previousMaxValue;
  Question.findOne({
      _id: req.params.id
    })
    .then(question => {
      previousMaxValue = question.maxValue
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
              value: Number(req.body.Opt1Value)
            },
            {
              name: "Opt2",
              text: req.body.Opt2,
              value: Number(req.body.Opt2Value)
            }
          ];

          maxValue = Number(req.body.Opt1Value) + Number(req.body.Opt2Value);

          if (req.body.Opt3) {
            options.push({
              name: "Opt3",
              text: req.body.Opt3,
              value: Number(req.body.Opt3Value)
            });
            maxValue = maxValue + Number(req.body.Opt3Value);
          }

          if (req.body.Opt4) {
            options.push({
              name: "Opt4",
              text: req.body.Opt4,
              value: Number(req.body.Opt4Value)
            });
            maxValue = maxValue + Number(req.body.Opt4Value);
          }

          if (req.body.Opt5) {
            options.push({
              name: "Opt5",
              text: req.body.Opt5,
              value: Number(req.body.Opt5Value)
            });
            maxValue = maxValue + Number(req.body.Opt5Value);
          }

          question.answers = options
          question.maxValue = maxValue;



          question.save()
            .then(question => {
              factor.highestScore = factor.highestScore - previousMaxValue + maxValue;
              factor.save()
                .then(() => {
                  res.redirect('/admin/questions/1');
                });
            });
        });
    });
});

// factor delete route
router.delete('/questions/delete/:id', ensureAuthenticated, adminAuthenticated, (req, res, next) => {
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
router.get("/preview/introduction", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("preview/assessment", {
    preview: true,
    introductionActive: true
  });
});

router.get("/preview/personal-information", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("preview/personal-information", {
    title: "Personal Information",
    preview: true,
    personalInfoActive: true
  });
});

router.get("/preview/individual-attributes", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  Question.find({
      section: "Individual Attributes"
    })
    .then(question => {
      Factor.find({
          section: "Individual Attributes"
        })
        .then(factors => {
          res.render("preview/individual-attributes", {
            title: "Individual Attributes",
            questions: question,
            factors: factors,
            preview: true,
            individualAttrActive: true
          });
        });
    });
});

router.get("/preview/life-factors", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  Question.find({
      section: "Life Factors"
    })
    .then(question => {
      Factor.find({
          section: "Life Factors"
        })
        .then(factors => {
          res.render("preview/life-factors", {
            title: "Life Factors",
            questions: question,
            factors: factors,
            preview: true,
            lifeFactorsActive: true
          });
        });
    });
});

router.get("/preview/technology-factors", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  Question.find({
      section: "Technical Factors"
    })
    .then(question => {
      Factor.find({
          section: "Technical Factors"
        })
        .then(factors => {
          res.render("preview/technology-factors", {
            title: "Technical Factors",
            questions: question,
            factors: factors,
            preview: true,
            technologyFactorsActive: true
          });
        });
    });
});

router.get("/preview/reading", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("preview/reading-passage", {
    title: "Reading Skills",
    passageP1: passageP1,
    passageP2: passageP2,
    preview: true,
    readingPassageActive: true
  });
});

router.get("/preview/typing", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("preview/typing", {
    title: "Typing Skills",
    preview: true,
    typingActive: true
  });
});

router.get("/preview/wifi", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("preview/wifiTest", {
    title: "Download Speed",
    preview: true,
    wifiActive: true
  });
});

router.get("/preview/reading-questions", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  Question.find({
    section: "Reading Skills"
  }).then(question => {
    res.render("preview/reading-questions", {
      title: "Reading Skills",
      questions: question,
      comprehsionActive: true
    });
  });
});














// admin results route
router.get("/results", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("admin/results", {
    results: true
  });
});

// admin settings route
router.get("/settings", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("admin/settings", {
    setting: true
  });
});

// admin settings route
router.get("/documentation", ensureAuthenticated, adminAuthenticated, (req, res, next) => {
  res.render("admin/documentation", {
    documentation: true
  });
});



router.get("/*", (req, res, next) => {
  res.redirect("/");
});


module.exports = router;