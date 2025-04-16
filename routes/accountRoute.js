// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")

const utilities = require("../utilities/")
const authMiddleware = require("../middleware/authMiddleware")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// router.get("/detail/:inventoryId", invController.buildByInventoryId)
// router.get("/generate-error", invController.generateError)
router.get("/login", utilities.handleErrors(accountController.buildLogin) )
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post('/register',regValidate.registationRules(),regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.post('/login',regValidate.loginRules(), regValidate.checkLogData, utilities.handleErrors(accountController.loginToAccount))
router.get("/", authMiddleware.checkLogin,utilities.handleErrors(accountController.buildAccount))
// Update Account View
router.get('/update/:accountId',authMiddleware.checkLogin, utilities.handleErrors(accountController.updateAccountView));

// Process Account Update
router.post('/update',authMiddleware.checkLogin, regValidate.updateAccountValidationRules(),regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountProcess));
router.get("/logout", utilities.handleErrors(accountController.logout))
router.get("/management", authMiddleware.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Process Password Change
router.post('/change-password', authMiddleware.checkLogin,regValidate.changePasswordValidationRules(),regValidate.checkUpdatePasswordData, utilities.handleErrors(accountController.changePasswordProcess));
module.exports = router;