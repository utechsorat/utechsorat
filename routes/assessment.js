// require
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../helpers/auth");

// models
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Result = require("../models/Result");
const Factor = require("../models/Factor");
const User = require("../models/User");
const PersonalInfo = require("../models/PersonalInfo");

//variables
var passageP1 =
  'Washington DC is the capital of the United States of America. Washington takes its name from the first president of America , George Washington. The "Columbia" in "District of Columbia" stands for ............. well there are many theories to why it was named "Columbia"( I just hope it had nothing to do with Christopher Columbus because I know he did not "discover" that area of land too ). The capital of the United States is home to over 10 memorials and landmarks that commemorate some astounding events in history. These exquisitely designed landmarks attract tourists from across the globe.'
  

var passageP2 =  "I visited Washington DC in the summer of 2014 and it was extremely hot, so if you are planning to visit stock up on bottles of water and some sunscreen. Areas near landmarks are only accessible by foot so comfortable shoes are a must. If you are adventurous like I am then you will want to visit most of the landmarks which is alot alot ALOT of walking lol, so some earphones and your favourite playlist will keep you energized and moving quickly.  What is a trip without pictures?? Selfie!!! Ensure you have a reliable camera and always have charged batteries or a powerbank."



// assessment begining route (get)
router.get("/", ensureAuthenticated, (req, res, next) => {
  User.findOne({ _id: req.user._id }).then(user => {
    res.render("assessment/assessment", {
      title: "Assessment",
      section: user.section
    });
  });
});

// personal infomation route (get)
router.get("/personal-information", ensureAuthenticated, (req, res, next) => {
  res.render("assessment/personal-information", {
    title: "Personal Information"
  });
});

// personal infomation route (post)
router.post("/personal-information", ensureAuthenticated, (req, res, next) => {
  // if these personal information are already present delete them to prevent duplicates
  const query = { user: req.user._id };
  PersonalInfo.removePersonalInfo(query, (err, personalInfo) => {
    if (err) {
      res.send(err);
    }
  });

  //
  var disability = req.body.disability;
  if (disability == "other") {
    disability = req.body.other - disability;
  }

  const personalInfo = new PersonalInfo({
    gender: req.body.gender,
    age: req.body.age,
    nationality: req.body.nationality,
    residence: req.body.residence,
    faculty: req.body.faculty,
    interest: req.body.interest,
    disability: disability,
    user: req.user._id
  });

  PersonalInfo.addPersonalInfo(personalInfo, (err, personalInfo) => {
    if (err) {
      res.send(err);
    }
  });

  const query2 = { _id: req.user._id };
  const update = { section: "individual-attributes" };
  User.updateSection(query2, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/individual-attributes");
});

// individual attributes route (get)
router.get("/individual-attributes",ensureAuthenticated, (req, res, next) => {
  Question.find({ section: "Individual Attributes" }).then(question => {
    Factor.find({ section: "Individual Attributes" }).then(factors => {
      res.render("assessment/individual-attributes", {
        title: "Individual Attributes",
        questions: question,
        factors: factors
      });
    });
  });
});

// individual attributes route (post)
router.post("/individual-attributes", ensureAuthenticated, (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if (err) {
      res.send(err);
    }

    // get factors for individual attributes from database
    const query = {
      section: "Individual Attributes",
      questionCount: { $gt: 0 }
    };
    Factor.getFactorBySection(query, (err, factors) => {
      for (var i = 0; i < questions.length; i++) {
        var questionName = questions[i]._id;
        for (var j = 0; j < factors.length; j++) {
          if (questions[i].factor == factors[j].title) {
            factors[j].score =
              factors[j].score + Number(req.body[questionName]);
          }
        }
      }

      for (var i = 0; i < factors.length; i++) {
        var value = Math.ceil(factors[i].score / factors[i].highestScore * 100);
        var response = "response error";
        if (value >= 0 && value <= 49) {
          response = factors[i].lowResponse;
        } else if (value >= 50 && value <= 79) {
          response = factors[i].mediumResponse;
        } else if (value >= 80 && value <= 100) {
          response = factors[i].highResponse;
        } else {
          response = "no response";
        }

        const result = new Result({
          section: "Individual Attributes",
          factor: factors[i].title,
          value: value,
          response: response,
          user: req.user._id
        });

        // if these results are already present delete them to prevent duplicates
        const query = { section: "Individual Attributes", user: req.user._id };
        Result.removeResult(query, (err, results) => {
          if (err) {
            res.send(err);
          }
        });

        Result.addResult(result, (err, result) => {
          if (err) {
            res.send(err);
          }
        });
      }
    });
  });

  const query = { _id: req.user._id };
  const update = { section: "life-factors" };
  User.updateSection(query, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/life-factors");
});

// life factors route (get)
router.get("/life-factors", ensureAuthenticated, (req, res, next) => {
  Question.find({ section: "Life Factors" }).then(question => {
    Factor.find({ section: "Life Factors" }).then(factors => {
      res.render("assessment/life-factors", {
        title: "Life Factors",
        questions: question,
        factors: factors
      });
    });
  });
});

// life factors route (post)
router.post("/life-factors",ensureAuthenticated, (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if (err) {
      res.send(err);
    }

    // get factors for life factors from database
    const query = { section: "Life Factors", questionCount: { $gt: 0 } };
    Factor.getFactorBySection(query, (err, factors) => {
      for (var i = 0; i < questions.length; i++) {
        var questionName = questions[i]._id;
        for (var j = 0; j < factors.length; j++) {
          if (questions[i].factor == factors[j].title) {
            factors[j].score =
              factors[j].score + Number(req.body[questionName]);
          }
        }
      }

      for (var i = 0; i < factors.length; i++) {
        var value = Math.ceil(factors[i].score / factors[i].highestScore * 100);
        var response = "response error";
        if (value >= 0 && value <= 49) {
          response = factors[i].lowResponse;
        } else if (value >= 50 && value <= 79) {
          response = factors[i].mediumResponse;
        } else if (value >= 80 && value <= 100) {
          response = factors[i].highResponse;
        } else {
          response = "no response";
        }
        const result = new Result({
          section: "Life Factors",
          factor: factors[i].title,
          response: response,
          value: value,
          user: req.user._id
        });

        const query = { section: "Life Factors", user: req.user._id };
        Result.removeResult(query, (err, results) => {
          if (err) {
            res.send(err);
          }
        });

        Result.addResult(result, (err, result) => {
          if (err) {
            res.send(err);
          }
        });
      }
    });
  });
  const query = { _id: req.user._id };
  const update = { section: "technology-factors" };
  User.updateSection(query, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/technology-factors");
});

// technology factors route (get)
router.get("/technology-factors", ensureAuthenticated, (req, res, next) => {
  Question.find({ section: "Technical Factors" }).then(question => {
    Factor.find({ section: "Technical Factors" }).then(factors => {
      res.render("assessment/technology-factors", {
        title: "Technical Factors",
        questions: question,
        factors: factors
      });
    });
  });
});

// technology factors route (post)
router.post("/technology-factors",ensureAuthenticated, (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if (err) {
      res.send(err);
    }

    // get factors for technology factors from database
    const query = { section: "Technical Factors", questionCount: { $gt: 0 } };
    Factor.getFactorBySection(query, (err, factors) => {
      for (var i = 0; i < questions.length; i++) {
        var questionName = questions[i]._id;
        for (var j = 0; j < factors.length; j++) {
          if (questions[i].factor == factors[j].title) {
            factors[j].score =
              factors[j].score + Number(req.body[questionName]);
          }
        }
      }

      for (var i = 0; i < factors.length; i++) {
        var value = Math.ceil(factors[i].score / factors[i].highestScore * 100);
        var response = "response error";
        if (value >= 0 && value <= 49) {
          response = factors[i].lowResponse;
        } else if (value >= 50 && value <= 79) {
          response = factors[i].mediumResponse;
        } else if (value >= 80 && value <= 100) {
          response = factors[i].highResponse;
        } else {
          response = "no response";
        }

        const result = new Result({
          section: "Technical Factors",
          factor: factors[i].title,
          value: value,
          response: response,
          user: req.user._id
        });

        // if these results are already present delete them to prevent duplicates
        const query = { section: "Technical Factors", user: req.user._id };
        Result.removeResult(query, (err, results) => {
          if (err) {
            res.send(err);
          }
        });

        Result.addResult(result, (err, result) => {
          if (err) {
            res.send(err);
          }
        });
      }
      const query = { _id: req.user._id };
      const update = { section: "reading" };
      User.updateSection(query, update, {}, (err, user) => {
        if (err) {
          res.send(err);
        }
      });

      res.redirect("/assessment/reading");
    });
  });
});

// reading route (get)
router.get("/reading", ensureAuthenticated, (req, res, next) => {
  res.render("assessment/reading-passage", {
    title: "Reading Skills",
    passageP1: passageP1,
    passageP2: passageP2,
  });
});

// complete route (get)
router.get("/complete", ensureAuthenticated, (req, res, next) => {
  res.render("assessment/complete", {
    title: "Complete"
  });
});

// restart assessment route (get)
router.get("/restart", ensureAuthenticated, (req, res, next) => {
  const query = { _id: req.user._id };
  const update = { section: "personal-information" };
  User.updateSection(query, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/personal-information");
});

router.get(
  "/reading-questions/:time",
  ensureAuthenticated,
  (req, res, next) => {
    readingTime = req.params.time / 7490;
    var perMinute = readingTime / 60;
    var passage = passageP1+passageP2;
    var wordCount = passage.split(" ").length;
    var wpm = Math.ceil(wordCount / perMinute);
    var value = wpm;
    

    // get factors for reading and comprehension from database
    const query = {
      title: "Reading Speed"
    };
    Factor.getFactorBySection(query,  (err, factors) => {
      for (var i = 0; i < factors.length; i++) {
        var response = "response error";
        if (value >= 0 && value <= 99) {
          response = factors[i].lowResponse;
        } else if (value >= 100 && value <= 199) {
          response = factors[i].mediumResponse;
        } else if (value >= 200 && value <= 1000) {
          response = factors[i].highResponse;
        } else {
          response = "no response";
        }
      }

      const result = new Result({
        section: "Reading Skills",
        factor: "Reading Speed",
        value: wpm,
        response: response,
        user: req.user._id
      });

      // if these results are already present delete them to prevent duplicates
      const query = { factor: "Reading Speed", user: req.user._id };
      Result.removeResult(query, (err, results) => {
        if (err) {
          res.send(err);
        }
      });

      Result.addResult(result, (err, result) => {
        if (err) {
          res.send(err);
        }
      });
    });

    const query1 = { _id: req.user._id };
    const update = { section: "reading" };
    User.updateSection(query1, update, {}, (err, user) => {
      if (err) {
        res.send(err);
      }
    });

    Question.find({ section: "Reading Skills" }).then(question => {
      res.render("assessment/reading-questions", {
        title: "Reading Skills",
        questions: question
      });
    });
  }
);

// reading questions route (post)
router.post("/reading-questions", ensureAuthenticated, (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if (err) {
      res.send(err);
    }

    // get factors for reading and comprehension from database
    const query = {
      title: "Comprehension",
      questionCount: { $gt: 0 }
    };
    Factor.getFactorBySection(query, (err, factors) => {
      for (var i = 0; i < questions.length; i++) {
        var questionName = questions[i]._id;
        for (var j = 0; j < factors.length; j++) {
          if (questions[i].factor == factors[j].title) {
            factors[j].score =
              factors[j].score + Number(req.body[questionName]);
          }
        }
      }

      // create the result
      for (var i = 0; i < factors.length; i++) {
        var value = Math.ceil(factors[i].score / factors[i].highestScore * 100);
        var response = "response error";
        if (value >= 0 && value <= 49) {
          response = factors[i].lowResponse;
        } else if (value >= 50 && value <= 79) {
          response = factors[i].mediumResponse;
        } else if (value >= 80 && value <= 100) {
          response = factors[i].highResponse;
        } else {
          response = "no response";
        }
        const result = new Result({
          section: "Reading Skills",
          factor: factors[i].title,
          value: value,
          response: response,
          user: req.user._id
        });

        // if these results are already present delete them to prevent duplicates
        const query = { factor: "Comprehension", user: req.user._id };
        Result.removeResult(query, (err, results) => {
          if (err) {
            res.send(err);
          }
        });

        Result.addResult(result, (err, result) => {
          if (err) {
            res.send(err);
          }
        });
      }
    });
  });
  const query = { _id: req.user._id };
  const update = { section: "typing" };
  User.updateSection(query, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/typing");
});

// typing route (get)
router.get("/typing", ensureAuthenticated, (req, res, next) => {
  res.render("assessment/typing", {
    title: "Typing Skills"
  });
});

router.post("/typing", ensureAuthenticated, (req, res, next) => {
  var correctWord = req.body.wpm;
  var value = correctWord.split(" ").length.toFixed();

  var response = "response error";
  if (value >= 0 && value <= 49) {
    response = "low response";
  } else if (value >= 50 && value <= 79) {
    response = "medium response";
  } else if (value >= 80 && value <= 100) {
    response = "high response";
  } else {
    response = "no response";
  }
  const result = new Result({
    section: "Typing Skills",
    factor: "Typing Speed",
    value: value,
    response: response,
    user: req.user._id
  });

  // if these results are already present delete them to prevent duplicates
  const query = { factor: "Typing Speed", user: req.user._id };
  Result.removeResult(query, (err, results) => {
    if (err) {
      res.send(err);
    }
  });

  Result.addResult(result, (err, result) => {
    if (err) {
      res.send(err);
    }
  });

  const query1 = { _id: req.user._id };
  const update = { section: "downloadTest" };
  User.updateSection(query1, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/downloadTest");
});

// wifiTest route (get)
router.get("/downloadTest", ensureAuthenticated, (req, res, next) => {
  res.render("assessment/wifiTest", {
    title: "Download Speed"
  });
});

// wifiTest route (post)
router.post("/download-test", ensureAuthenticated, (req, res, next) => {
  var resultMBps = req.body.wifi;
  var value = resultMBps;

  var response = "response error";
  if (value >= 0 && value <= 49) {
    response = "low responsez";
  } else if (value >= 50 && value <= 79) {
    response = "medium response";
  } else if (value >= 80 && value <= 100) {
    response = "high response";
  } else {
    response = "no response";
  }
  const result = new Result({
    section: "Download Speed",
    factor: "Download Speed",
    value: value,
    response: response,
    user: req.user._id
  });

  // if these results are already present delete them to prevent duplicates
  const query = { factor: "Download Speed", user: req.user._id };
  Result.removeResult(query, (err, results) => {
    if (err) {
      res.send(err);
    }
  });

  Result.addResult(result, (err, result) => {
    if (err) {
      res.send(err);
    }
  });

  const query2 = { _id: req.user._id };
  const update = { section: "complete" };
  User.updateSection(query2, update, {}, (err, user) => {
    if (err) {
      res.send(err);
    }
  });
  res.redirect("/assessment/complete");
});

router.get('/*', (req, res, next) => {
  res.redirect("/assessment")
});

module.exports = router;
