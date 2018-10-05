const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

// load database config
const db = require('./config/database');

// load routes
const users = require("./routes/users");
const assessment = require("./routes/assessment");
const results = require("./routes/results");
const questions = require("./routes/questions");
const factors = require("./routes/factors");
const categories = require("./routes/categories");
const manage = require("./routes/manage");
const report = require("./routes/report");

const port = process.env.PORT || 3000;  

const app = express();

// passport config
require("./config/passport")(passport);



// mongoose middleware
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// express-handlebars middleware
app.engine("handlebars", exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(path.join(__dirname, "public")));

// index route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});

// admin route
app.get("/admin", (req, res) => {
  res.render("admin/dashboard");
});

// routes middleware
app.use("/users", users);
app.use("/assessment", assessment);
app.use("/results", results);
app.use("/questions", questions);
app.use("/factors", factors);
app.use("/categories", categories);
app.use("/manage", manage);
app.use("/report", report);

// invalid routes
app.get("/*", (req, res, next) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
