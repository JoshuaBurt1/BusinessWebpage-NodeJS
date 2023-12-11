//reusable middleware function for authentication
//checks for an authenticated user
function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
  }
  module.exports = IsLoggedIn;
