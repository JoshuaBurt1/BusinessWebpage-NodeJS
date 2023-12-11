//Model represents hosting in my database
const mongoose = require("mongoose");
const testingSchemaObj = {
  name: { type: String, required: true },
};
var testingSchema = new mongoose.Schema(testingSchemaObj);
module.exports = mongoose.model("Test", testingSchema);

//note: naming convention > models are singular, routers are plural
