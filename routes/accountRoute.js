// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")

const utilities = require("../utilities/")

const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// router.get("/detail/:inventoryId", invController.buildByInventoryId)
// router.get("/generate-error", invController.generateError)
router.get("/login", utilities.handleErrors(accountController.buildLogin) )
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post('/register',regValidate.registationRules(),regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.post('/login',regValidate.loginRules(), regValidate.checkLogData, utilities.handleErrors(accountController.loginToAccount))


module.exports = router;