const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let form = utilities.buildForm("login")
req.flash("notice", "This is the login page.")
  res.render("account/login", {
    title: "Login",
    nav,
    form,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
   let form = utilities.buildForm("register")
  res.render("account/register", {
    title: "Register",
    nav,
    form,
    errors: null
  })
}

async function  registerAccount (req, res){
    let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    let form = utilities.buildForm("login")
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      form
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let form = utilities.buildForm("register")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      form
    })
  }

}


async function  loginAccount (req, res, next){
    
}
module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }