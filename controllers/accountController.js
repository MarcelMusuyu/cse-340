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
                      res.cookie("user",user, { maxAge: 3600 * 1000 });
                      res.cookie("loggedin", true, { maxAge: 3600 * 1000 })
                      res.status(200).render("account/account-management", {
                        errors: null,
                        title: "Account Management",
                        nav,
                        user,
                      })
                     
                     
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

async function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function updateAccountView(req, res) {
  let nav = await utilities.getNav()
  const accountId = parseInt(req.params.accountId);
  if (isNaN(accountId) || accountId !== req.cookies.user.account_id) {
    return res.redirect('/account'); // Or handle unauthorized access
  }
  const accountData = await accountModel.getAccountById(accountId);
  if (accountData) {
    res.render('account/update', { title: 'Update Account', 
      account: accountData,
      nav,
    errors: null
   });
  } else {
    res.redirect('/account'); // Or handle account not found
  }
  
} 



const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({ msg: err.msg }));
    return res.render('account/update', {
      title: 'Update Account',
      errors: extractedErrors,
      account: req.body, // For sticky inputs
    });
  }
  next();
};

async function updateAccountProcess(req, res) {
   const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
 let nav = await utilities.getNav()
  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id);
    req.flash("notice", `Account information updated successfully. These are new values ${updatedAccount.account_firstname} - ${updatedAccount.account_lastname}- ${updatedAccount.account_email}.`)
    res.render('account/account-management', {
      title: 'Account Management',
      message: 'Account information updated successfully.',
      user: updatedAccount,
      loggedin: true, // Ensure loggedin is true
      nav,
    });
  } else {
    const accountData = await accountModel.getAccountById(account_id);
    res.render('account/update', {
      title: 'Update Account',
      errors: [{ msg: 'Failed to update account information.' }],
      account: accountData || req.body, // Show existing data or submitted data
      nav
    });
  }
}
async function changePasswordProcess(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
 
  // Hash the new password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      
    })
  }
  
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  //const accountId = parseInt(account_id);
  console.log("The id value is",account_id);
 const updatedAccount = await accountModel.getAccountById(account_id);
 console.log("updatedAccount", updatedAccount)
  if (updateResult) {
    req.flash("notice", "Your password has been successfully updated.")
    res.status(200).render("account/account-management", {
      title: "Account Management",
      nav,
      user: updatedAccount,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      
    })
  }
}
module.exports = { buildLogin, buildRegister, registerAccount, loginToAccount, buildAccount, logout , buildAccountManagement,updateAccountView,updateAccountProcess,
  
  changePasswordProcess}