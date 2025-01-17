var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// GET handler for /login
router.get("/login", (req, res, next) => {
  let messages = req.session.messages || []; //if null set an empty list
  req.session.messages = []; //clear messages
  res.render("login", { title: "Login to the App", messages: messages });
});

//POST /login (user click login button)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login",
    failureMessage: "Invalid Credentials",
  })
);

// GET handler for logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    res.redirect("/login");
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Portfolio", user: req.user });
});
// GET handler for /about
router.get("/about", (req, res, next) => {
  res.render("about", { title: "About Us", user: req.user });
});
// GET handler for /projects/index
router.get("/projects/index", (req, res, next) => {
  res.render("index");
});
// GET handler for /contacts
router.get("/contact", (req, res, next) => {
  res.render("contact", { title: "Contact", user: req.user });
});
// GET handler for /contacts
router.get("/analytics", (req, res, next) => {
  res.render("analytics", { title: "Analytics", user: req.user });
});

module.exports = router;
