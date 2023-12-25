// Import mongoose
const mongoose = require("mongoose");

// Create schema definition object using mapping notation
const projectsSchemaDefinition = {
  // add each element and its properties
  // note: changing updateDate type to String = 2010-10-10 format)
  name: { type: String, required: true },
  updateDate: { type: Date },
  language: { type: Array, required: true },
  host: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: String, required: true },
  issue: { type: String, default: "Running" }, //default
};

// Create new mongoose schema using the definition object
var projectsSchema = new mongoose.Schema(projectsSchemaDefinition);

// Create new mongoose model using the schema object and
// Import new model > provide name and schema
module.exports = mongoose.model("Project", projectsSchema);
// alternative > module.exports = mongoose.model('Project', projectsSchema);

//note: naming convention > models are singular, routers are plural
