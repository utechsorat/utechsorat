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

// login route (get)
router.get("/login", (req, res) => {
  res.render("users/login", {
    title: "Login"
  });
});

// login route (post)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// register route (get)
router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Register"
  });
});

// register route (post)
router.post("/register", (req, res) => {
  let errors = [];

  if (!req.body.firstname) {
    errors.push({
      text: "First Name is required."
    })
  }

  if (!req.body.lastname) {
    errors.push({
      text: "Last Name is required."
    })
  }

  if (!req.body.email) {
    errors.push({
      text: "Email is required."
    })
  }

  if (!req.body.password) {
    errors.push({
      text: "Password is required."
    })
  }

  if (req.body.password != req.body.password2) {
    errors.push({
      text: "Passwords do not match."
    });
  }

  if (req.body.password.length < 7) {
    errors.push({
      text: "Password must be at least 7 characters."
    });
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  if (!validateEmail(req.body.email)) {
    errors.push({
      text: "Please enter valid Email address"
    });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already regsitered");
        res.redirect("/users/register", {
          errors: errors,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2,
        });
      } else {
        const newUser = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: req.body.password,
          section: "personal-information",
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/*", (req, res, next) => {
  res.redirect("/");
});
module.exports = router;