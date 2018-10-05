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
const User = require("../models/User");
const PersonalInfo = require("../models/PersonalInfo");

router.get("/", ensureAuthenticated, (req, res, next) => {
  var residence = [];
  var residenceCount = [];

  var gender = [];
  var genderCount = [];

  var age = [];
  var ageCount = [];

  var nationality = [];
  var nationalityCount = [];

  

  var totalRespondents = [];

  User.count(function(err, result) {
    if (err) return err;
    totalRespondents.push(result);
  });

  PersonalInfo.aggregate(
    [
      {
        $group: {
          _id: "$residence",
          count: { $sum: 1 }
        }
      }
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      for (var i = 0; i < result.length; i++) {
        residence.push(result[i]._id);
        residenceCount.push(result[i].count);
      }

      PersonalInfo.aggregate(
        [
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 }
            }
          }
        ],
        function(err, result) {
          if (err) {
            console.log(err);
            return;
          }

          for (var i = 0; i < result.length; i++) {
            gender.push(result[i]._id);
            genderCount.push(result[i].count);
          }

          PersonalInfo.aggregate(
            [
              {
                $group: {
                  _id: "$age",
                  count: { $sum: 1 }
                }
              }
            ],
            function(err, result) {
              if (err) {
                console.log(err);
                return;
              }

              for (var i = 0; i < result.length; i++) {
                age.push(result[i]._id);
                ageCount.push(result[i].count);
              }

              PersonalInfo.aggregate(
                [
                  {
                    $group: {
                      _id: "$nationality",
                      count: { $sum: 1 }
                    }
                  }
                ],
                function(err, result) {
                  if (err) {
                    console.log(err);
                    return;
                  }

                  for (var i = 0; i < result.length; i++) {
                    nationality.push(result[i]._id);
                    nationalityCount.push(result[i].count);
                  }

                  res.render("admin/report", {
                    title: "Overall Report",
                    residence: JSON.stringify(residence),
                    residenceCount: JSON.stringify(residenceCount),
                    gender: JSON.stringify(gender),
                    genderCount: JSON.stringify(genderCount),
                    age: JSON.stringify(age),
                    ageCount: JSON.stringify(ageCount),
                    nationality: JSON.stringify(nationality),
                    nationalityCount: JSON.stringify(nationalityCount),
                    totalRespondents: JSON.stringify(totalRespondents)
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
