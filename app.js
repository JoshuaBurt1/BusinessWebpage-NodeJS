//1. EXPRESS
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//2. DATABASE MongoDB CONNECTIONS
// Option 2) Add connection string to Config file
//const config = require("./config/globals");
//let connectionString = config.db;
const db_config = process.env.DB_STRING;
let connectionString = db_config;
var mongoose = require("mongoose");
//Configure mongoose (initial database connection)
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((message) => {
    console.log("Connected successfully!");
  }) //do something after connecting
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  }); //catch any errors

//3. AUTHENTICATION
var passport = require("passport");
var session = require("express-session");
const githubStrategy = require("passport-github2").Strategy;
var User = require("./models/user"); //model already contains functionality from plm

//Configure session handling
app.use(
  session({
    secret: "essentialSoftware1",
    resave: false,
    saveUninitialized: false,
  })
);
//Configure passport module
app.use(passport.initialize());
app.use(passport.session());
//Configure local strategy method
passport.use(User.createStrategy()); //createStrategy comes from plm
// Configure passport-github2 with the API keys and user model
// We need to handle two scenarios: new user, or returning user
passport.use(
  new githubStrategy(
    // options object
    {
      //clientID: config.github.clientId,
      //clientSecret: config.github.clientSecret,
      //callbackURL: config.github.callbackUrl,
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECRET,
      callbackURL: process.env.GITHUB_CALLBACKURL,
    },
    // create async callback function
    // profile is github profile
    async (accessToken, refreshToken, profile, done) => {
      // search user by ID
      const user = await User.findOne({ oauthId: profile.id });
      // user exists (returning user)
      if (user) {
        // no need to do anything else
        return done(null, user);
      } else {
        // new user so register them in the db
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: "Github",
          created: Date.now(),
        });
        // add to DB
        const savedUser = await newUser.save();
        // return
        return done(null, savedUser);
      }
    }
  )
);
//Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//4. ROUTER OBJECTS
var indexRouter = require("./routes/index");
var projectsRouter = require("./routes/projects");
var languagesRouter = require("./routes/languages");
var hostingRouter = require("./routes/hosting");
//ROUTING CONFIGURATIONS
app.use("/", indexRouter);
//app.use('/users', usersRouter);
app.use("/projects", projectsRouter);
app.use("/languages", languagesRouter);
app.use("/hosting", hostingRouter);

//HBS Helper Functions -> https://handlebarsjs.com/guide/block-helpers.html#basic-block-variation
var hbs = require("hbs");
//HOST HELPER (CREATES OPTION VALUE FOR HOST & LANGUAGE MODEL)
hbs.registerHelper("createOptionElement", (listValue, selectedValue) => {
  let selectedProperty = ""; //empty by default
  if (listValue == selectedValue) {
    selectedProperty = "selected";
  }
  let optionElement = `<option ${selectedProperty}>${listValue}</option>`;
  return new hbs.SafeString(optionElement);
});

//ROUTING ERRORS
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
