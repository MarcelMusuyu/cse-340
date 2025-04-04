const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
 
req.flash("notice", "This is the login page.")
  res.render("account/login", {
    title: "Login",
    nav,
  
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
   
  res.render("account/register", {
    title: "Register",
    nav,
  
    errors: null
  })
}

async function  registerAccount (req, res){
  
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body


  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
     
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword 
  )

  if (regResult) {
    
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
   
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }else {
    req.flash("notice", "Sorry, the registration failed.")
   
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      
    })
  }
  

}


async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("account/account-management", {
    title: "Account",
    nav,
    errors: null,
   
  })
}

async function  loginToAccount (req, res, next){
   

  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const result = await accountModel.getAccountByEmail(account_email)
  
 
  if (!result) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
 

  if (result) {

      const user = result;
      const hashedPassword = user.account_password; // Assuming this is the column name in your database
      
              try{
      
                  const isMatch = await bcrypt.compare(account_password, hashedPassword)
                  
                    if (isMatch) {
                      delete user.account_password // Remove password from user object

                      const accessToken = jwt.sign(
                        { user: user },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: 3600*1000 } // 1 hour
                      )

                      if(process.env.NODE_ENV === 'development') {
                          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
                      } else {
                          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
                      }
                      return res.redirect("/account/")
                      // Passwords match, generate JWT or session
                  
                    }else {
                        req.flash("message notice", "Please check your credentials and try again.")
                        res.status(400).render("account/login", {
                          title: "Login",
                          nav,
                          errors: null,
                          account_email,
                        })
                      }
              } catch (error) {
                  throw new Error('Access Forbidden')
              }
            
              } else {
                req.flash("notice", "Username/Password Incorrect !!!")
              
                res.status(501).render("account/login", {
                  title: "login",
                  nav,
                
                })
              }

      
  
}
module.exports = { buildLogin, buildRegister, registerAccount, loginToAccount, buildAccount }