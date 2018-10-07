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

// admin dashboard route
router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", {
    dashboard: true
  });
});

// admin users route
router.get("/users/:page", (req, res, next) => {
  const perPage = 5;
  const page = req.params.page || 1;

  User.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, users){
      User.count().exec(function(err, count){
        if(err){
          return next(err)
        }
        res.render("admin/users", {
          usersActive: true,
          users: users,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
});

// admin factors route
router.get("/factors", (req, res) => {
  res.render("admin/factors", {
    factors: true
  });
});

// admin questions route
router.get("/questions", (req, res) => {
  res.render("admin/questions", {
    questions: true
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