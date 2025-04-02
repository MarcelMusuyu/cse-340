const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

const bcrypt = require("bcryptjs")

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
   
    })
  }else {
    req.flash("notice", "Sorry, the registration failed.")
   
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    
    })
  }
  

}


async function  loginToAccount (req, res, next){
   

  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const result = await accountModel.loginAccount(account_email)
 

  if (result.rows.length > 0) {

      const user = result.rows[0];
      const hashedPassword = user.account_password; // Assuming this is the column name in your database

      const isMatch = bcrypt.compareSync(account_password, hashedPassword)
      
        if (isMatch) {
          // Passwords match, generate JWT or session
          const payload = {
            user: {
              id: user.account_id, // Assuming account_id is the user's ID
              email: user.account_email,
              // Add other user data you need in the token
            },
          };
          req.flash(
          "notice",
          `Congratulations, you\'re logged in ${account_email}.`
        )
        res.status(201).send(payload)
        }else{
          req.flash("notice", "Invalid Password.")
       
          res.status(501).render("account/login", {
            title: "login",
            nav,
           
          })
        }
        
     
      } else {
        req.flash("notice", "Username/Password Incorrect !!!")
      
        res.status(501).render("account/login", {
          title: "login",
          nav,
        
        })
      }

  
}
module.exports = { buildLogin, buildRegister, registerAccount, loginToAccount }