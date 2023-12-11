// Import express and create a router object
const express = require("express");
const router = express.Router();
// Import mongoose model to be used
const Project = require("../models/project");
const Language = require("../models/language");
const Host = require("../models/host");
const IsLoggedIn = require("../extensions/authentication");

// add reusable middleware function to inject it in our handlers below that need authorization
//   1. prevents non-logged in viewer from seeing add button in projects
//   2. does not stop non-logged in viewer from entering URL to view: 
//   http://localhost:3000/Projects/add

//Authentication middleware
//Adding to route prevents users from accessing page by URL modification:  (moved to extensions folder)
//   function IsLoggedIn(req,res,next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/login');
//   }

//Configure GET/POST handlers
//GET handler for index /projects/ <<landing/root page of my section
//R > Retrieve/Read usually shows a list (filtered/unfiltered)
router.get("/", (req, res, next) => {
  //res.render("projects/index", { title: "Project Tracker" });
  //renders data in table
  Project.find()
    .sort({ language: 1 }) //sorting function (alphabetically)
    .then((projects) => {
      res.render("projects/index", {
        title: "Project Tracker Dataset",
        dataset: projects,
        user: req.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//note: NEED TO COMBINE THESE 2 FUNCTIONS TO RENDER ASYNCHRONOUSLY (see below)
// //GET handler for index /projects/add
// router.get("/add", (req, res, next) => {
//   //res.render("projects/add", { title: "Add a New Project" });
//   Language.find()
//     .then((languageList) => {
//       res.render("projects/add", {
//         title: "Add a new Project",
//         languages: languageList,
//         user: req.user,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
// //GET handler for index /projects/add
// router.get("/add", (req, res, next) => {
//   //res.render("projects/add", { title: "Add a New Project" });
//   Host.find()
//     .then((hostList) => {
//       res.render("projects/add", {
//         title: "Add a new Project",
//         hosting: hostList,
//         user: req.user,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

router.get("/add", IsLoggedIn, async (req, res, next) => {
  try {
    const [languageList, hostList] = await Promise.all([
      Language.find().exec(),
      Host.find().exec(),
    ]);
    res.render("projects/add", {
      title: "Add a new Project",
      languages: languageList,
      hosting: hostList,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    // Handle the error appropriately
  }
});

//POST handler (save button action)
router.post("/add", IsLoggedIn,(req, res, next) => {
  //res.redirect("/projects");
  //use the project module to save data to DB
  Project.create({
    name: req.body.name,
    updateDate: req.body.updateDate,
    language: req.body.language,
    host: req.body.host,
    image: req.body.image,
    link: req.body.link,
    status: req.body.status,
  })
    .then((createdModel) => {
      console.log("Model created successfully:", createdModel);
      // We can show a successful message by redirecting them to index
      res.redirect("/projects");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

//TODO C > Create new project
//GET handler for /projects/add (loads)
router.get("/add",IsLoggedIn, (req, res, next) => {
  res.render("projects/add", { title: "Add a new Project" });
});

//POST handler for /projects/add (receives input data)
router.post("/add", (req, res, next) => {
  Project.create(
    {
      name: req.body.name,
      updateDate: req.body.updateDate,
      language: req.body.language,
      host: req.body.host,
      image: req.body.image,
      link: req.body.link,
      status: req.body.status,
    }, //new project to add
    (err, newProject) => {
      res.redirect("/projects");
    } // callback function
  );
});

//note: NEED TO COMBINE THESE 2 FUNCTIONS TO RENDER ASYNCHRONOUSLY (see below)
//TODO U > Update given project
// GET /projects/edit/ID
// router.get("/edit/:_id", (req, res, next) => {
//   Project.findById(req.params._id)
//     .then((projectObj) =>
//       Language.find().then((languageList) => ({ projectObj, languageList }))
//     )
//     .then(({ projectObj, languageList }) => {
//       res.render("projects/edit", {
//         title: "Edit a Project",
//         project: projectObj,
//         languages: languageList,
//         user: req.user,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });
// // GET /projects/edit/ID
// router.get("/edit/:_id", (req, res, next) => {
//   Project.findById(req.params._id)
//     .then((projectObj) =>
//       Host.find().then((hostList) => ({ projectObj, hostList }))
//     )
//     .then(({ projectObj, hostList }) => {
//       res.render("projects/edit", {
//         title: "Edit a Project",
//         project: projectObj,
//         hosting: hostList,
//         user: req.user,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

router.get("/edit/:_id", IsLoggedIn, async (req, res, next) => {
  try {
    const projectObj = await Project.findById(req.params._id).exec();
    const [languageList, hostList] = await Promise.all([
      Language.find().exec(),
      Host.find().exec(),
    ]);
    res.render("projects/edit", {
      title: "Edit a Project",
      project: projectObj,
      languages: languageList,
      hosting: hostList,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
  }
});

// POST /projects/editID
router.post("/edit/:_id", (req, res, next) => {
  Project.findOneAndUpdate(
    { _id: req.params._id },
    {
      name: req.body.name,
      updateDate: req.body.updateDate,
      language: req.body.language,
      host: req.body.host,
      image: req.body.image,
      link: req.body.link,
      status: req.body.status,
      issue: req.body.issue,
    }
  )
    .then((updatedProject) => {
      res.redirect("/projects");
    })
    .catch((err) => {
      // handle any potential errors here
      // For example, you can redirect to an error page
      res.redirect("/error");
    });
});

//TODO D > Delete a project
// GET /projects/delete/652f1cb7740320402d9ba04d
router.get("/delete/:_id", IsLoggedIn, (req, res, next) => {
  let projectId = req.params._id;
  Project.deleteOne({ _id: projectId })
    .then(() => {
      res.redirect("/projects");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

// Export this router module
module.exports = router;
