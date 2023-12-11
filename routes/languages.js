const express = require("express");
const router = express.Router();
const Language = require("../models/language");
const IsLoggedIn = require("../extensions/authentication");

//moved to extensions folder
// function IsLoggedIn(req,res,next) {
//   if (req.isAuthenticated()) {
//       return next();
//   }
//   res.redirect('/login');
// }

// GET /languages/
router.get("/", IsLoggedIn,(req, res, next) => {
  Language.find()
    .sort({ name: 1 }) //sorting function (alphabetically)
    .then((languages) => {
      res.render("languages/index", {
        title: "Language List",
        dataset: languages,
        user: req.user,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /languages/add
router.get("/add", IsLoggedIn, (req, res, next) => {
  res.render("languages/add", { title: "Add a new language", user: req.user });
});

// POST /languages/add
router.post("/add", (req, res, next) => {
  Language.create({
    name: req.body.name,
    framework: req.body.framework,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      // We can show a successful message by redirecting them to index
      res.redirect("/languages");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//TODO D > Delete a language
// GET /projects/delete/652f1cb7740320402d9ba04d
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let languageId = req.params._id;
  Language.deleteOne({ _id: languageId })
    .then(() => {
      res.redirect("/languages");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
