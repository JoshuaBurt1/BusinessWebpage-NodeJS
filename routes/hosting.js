const express = require("express");
const router = express.Router();
const Host = require("../models/host");
const IsLoggedIn = require("../extensions/authentication");

//moved to extensions
// function IsLoggedIn(req,res,next) {
//   if (req.isAuthenticated()) {
//       return next();
//   }
//   res.redirect('/login');
// }

// GET /hosting/
router.get("/", IsLoggedIn,  (req, res, next) => {
  Host.find()
    .sort({ name: 1 }) //sorting function (alphabetically)
    .then((hosting) => {
      res.render("hosting/index", {
        title: "Host List",
        dataset: hosting,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /hosting/add
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("hosting/add", { title: "Add a new host", user: req.user });
});

// POST /hosting/add
router.post("/add", IsLoggedIn, (req, res, next) => {
  Host.create({
    name: req.body.name,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      // We can show a successful message by redirecting them to index
      res.redirect("/hosting");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//TODO D > Delete a host
// GET /projects/delete/652f1cb7740320402d9ba04d
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let hostId = req.params._id;
  Host.deleteOne({ _id: hostId })
    .then(() => {
      res.redirect("/hosting");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
