// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/inventory-validation')
const authMiddleware = require("../middleware/authMiddleware")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inventoryId", invController.buildByInventoryId)
router.get("/",authMiddleware.checkEmployeeOrAdmin, utilities.handleErrors(invController.viewManagement))
router.get("/addClassification",authMiddleware.checkEmployeeOrAdmin, utilities.handleErrors(invController.createClassification))
router.get("/addInventory",authMiddleware.checkEmployeeOrAdmin, invController.createInventory)
router.post("/addClassification",authMiddleware.checkEmployeeOrAdmin, regValidate.classificationRules() , regValidate.checkClassificationData, utilities.handleErrors(invController.insertClassification))
router.post("/addInventory",authMiddleware.checkEmployeeOrAdmin,regValidate.inventoryRules(), regValidate.checkInventoryData, utilities.handleErrors(invController.insertInventory))
router.get("/getInventory/:classification_id",authMiddleware.checkEmployeeOrAdmin, utilities.handleErrors(invController.getInventoryJSON))
// This route get an edit inventory view
router.get("/edit/:inventory_id",authMiddleware.checkEmployeeOrAdmin,utilities.handleErrors(invController.editInventory) )

router.post("/update/",authMiddleware.checkEmployeeOrAdmin,regValidate.newInventoryRules(), regValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))
// This route get an edit inventory view
router.get("/delete/:inventory_id",authMiddleware.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory) )

router.post("/delete/",authMiddleware.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventoryConfirm))
router.get("/generate-error", invController.generateError)

module.exports = router