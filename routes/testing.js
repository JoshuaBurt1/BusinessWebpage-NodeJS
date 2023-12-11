const express = require("express");
const router = express.Router();
const Test = require("../models/test");

// GET /hosting/
router.get("/", (req, res, next) => {
  res.render("testing/index", { title: "Testing" });
});

// Export this router module
module.exports = router;
