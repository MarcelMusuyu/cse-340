const jwt = require('jsonwebtoken');
const env = require("dotenv").config()
const utilities = require("../utilities/")
async function checkLogin(req, res, next) {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, user) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/account-management")
    }
    
    
    res.locals.user = user
    res.locals.loggedin = true
    next()
   })
 } else {
    res.locals.loggedin = false
  next()
 }
}


async function checkEmployeeOrAdmin(req, res, next) {
  
   
  if (req.cookies.user && (req.cookies.user.account_type === 'Employee' || req.cookies.user.account_type === 'Admin')) {
    next();
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "You do not have permission to access this page. Please log in with an Employee or Admin account.")
    res.render('account/login', {
      title: 'Login',
      message: 'You do not have permission to access this page. Please log in with an Employee or Admin account.',
      nav,
      errors: null,
    });
  }
}



module.exports = { checkLogin, checkEmployeeOrAdmin };